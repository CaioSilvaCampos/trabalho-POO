import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, // proibe chaves que nao estao no meu DTO
    forbidNonWhitelisted:true,//gera um erro quando a chave nao existir
    transform: true, 
  }))

  app.enableCors()
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
