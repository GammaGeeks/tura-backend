import { PrismaService } from 'src/prisma/prisma.service';

// utils/slug.utils.ts
export class SlugUtils {
  static async generateUniqueSlug(
    prisma: PrismaService,
    baseSlug: string,
  ): Promise<string> {
    let slug = baseSlug;
    let counter = 0;

    while (true) {
      const exists = await prisma.property.findFirst({
        where: { slug },
      });

      if (!exists) break;

      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    return slug;
  }

  static sanitizeSlug(text: string): string {
    if (!text) return '';

    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[àáâãäåāăąạảấầẩẫậắằẳẵặ]/g, 'a')
      .replace(/[èéêëēĕėęěẹẻẽếềểễệ]/g, 'e')
      .replace(/[ìíîïīĭįịỉĩ]/g, 'i')
      .replace(/[òóôõöōŏőọỏốồổỗộớờởỡợ]/g, 'o')
      .replace(/[ùúûüūŭůųụủũứừửữự]/g, 'u')
      .replace(/[ýÿỳỵỷỹ]/g, 'y')
      .replace(/[ñń]/g, 'n')
      .replace(/[çćčĉ]/g, 'c')
      .replace(/[ßśšşș]/g, 's')
      .replace(/[źžż]/g, 'z')
      .replace(/[ŕř]/g, 'r')
      .replace(/[ĺľł]/g, 'l')
      .replace(/[đďð]/g, 'd')
      .replace(/[ťţ]/g, 't')
      .replace(/[ǹ]/g, 'n')
      .replace(/[ğĝ]/g, 'g')
      .replace(/[ǘ]/g, 'u')
      .replace(/[ẍ]/g, 'x')
      .replace(/[ĥ]/g, 'h')
      .replace(/[ĵ]/g, 'j')
      .replace(/[ṗ]/g, 'p')
      .replace(/[ẅẃŵẁ]/g, 'w')
      .replace(/[ḿ]/g, 'm')
      .replace(/[ǣ]/g, 'ae')
      .replace(/[ŭ]/g, 'u')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}
