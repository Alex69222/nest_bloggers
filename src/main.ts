import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { useContainer, ValidationError } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigType } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService<ConfigType>);
  const port = configService.get('apiSettings', { infer: true }).port;
  const cookieSecret = configService.get('tokenSettings', {
    infer: true,
  }).cookieSecret;

  app.set('trust proxy', true);
  app.setGlobalPrefix('api');
  app.use(cookieParser(cookieSecret));
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
