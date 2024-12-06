import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    const key = `${folder}/${uniquePrefix}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);

    return key;
  }

  async generateSignedUrl(key: string): Promise<string> {
    // Simply return the CloudFront URL for the object
    return `https://${process.env.S3_CLOUDFRONT_DOMAIN}/${key}`;
  }

  // If you need to keep the signed URL functionality for private content:
  async generatePrivateSignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: 7200 });
  }

  async deletePropertyImages(imageUrls: string[]): Promise<boolean> {
    try {
      const deletePromises = imageUrls.map(async (imageUrl) => {
        // Extract the key from the URL
        let key: string;

        if (imageUrl.includes(process.env.S3_CLOUDFRONT_DOMAIN)) {
          // If using CloudFront URL
          key = imageUrl.split(process.env.S3_CLOUDFRONT_DOMAIN + '/')[1];
        } else if (imageUrl.includes(process.env.AWS_S3_BUCKET)) {
          // If using direct S3 URL
          key = imageUrl.split(
            process.env.AWS_S3_BUCKET + '.s3.amazonaws.com/',
          )[1];
        } else {
          // If the URL is already a key
          key = imageUrl;
        }

        if (!key) {
          this.logger.warn(`Could not extract key from URL: ${imageUrl}`);
          return false;
        }

        try {
          const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
          });

          await this.s3Client.send(command);
          this.logger.log(`Successfully deleted image: ${key}`);
          return true;
        } catch (error) {
          this.logger.error(`Failed to delete image ${key}: ${error.message}`);
          return false;
        }
      });

      // Wait for all deletions to complete
      const results = await Promise.allSettled(deletePromises);

      // Log any failures
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.logger.error(
            `Failed to delete image ${imageUrls[index]}: ${result.reason}`,
          );
        }
      });

      // Return true if at least one image was deleted successfully
      return results.some(
        (result) => result.status === 'fulfilled' && result.value === true,
      );
    } catch (error) {
      this.logger.error(`Error in deletePropertyImages: ${error.message}`);
      throw error;
    }
  }
}
