import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = [
    '*',
    'http://localhost:3000', // Development
    'https://your-frontend-domain.com', // Production
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow request
      } else {
        callback(new Error('Not allowed by CORS')); // Block request
      }
    },
    methods: 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
    credentials: true, // Allow cookies if needed
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
