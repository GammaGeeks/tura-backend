import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google-id-token',
) {
  private googleClient: OAuth2Client;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('credential'),
      secretOrKey: 'temp-secret', // This won't be used as we'll verify the token ourselves
    });

    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async validate(payload: any) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: payload.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const userData = ticket.getPayload();
      return {
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
