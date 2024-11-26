import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationExceptionFilter } from './filters/validation-exception.flter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không có trong DTO
      forbidNonWhitelisted: true, // Cấm các thuộc tính không xác định
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.enableCors({
    origin: true, // Your client URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization, ngrok-skip-browser-warning', // Add the ngrok header
    credentials: true, // Enable if you need to send cookies
  });
  await app.listen(configService.get('PORT'), () => {
    console.log(`Server is running on port ${configService.get('PORT')}`);
  });
}
bootstrap();
