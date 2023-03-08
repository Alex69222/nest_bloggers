import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './exeption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errorsArr: ValidationError[]) => {
        const errors = [];
        errorsArr.forEach((e) => {
          errors.push({
            message: e.constraints[Object.keys(e.constraints)[0]],
            field: e.property,
          });
        });
        throw new BadRequestException(errors);
      },
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port);
}
bootstrap();
