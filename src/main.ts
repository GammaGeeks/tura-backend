import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://main.d5fw14mc1awgo.amplifyapp.com/', // specify the frontend domain or '*' (not recommended for production)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
      'xyz',
    ],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
