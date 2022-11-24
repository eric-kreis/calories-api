import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const { PORT = 3000 } = process.env;
const logger = new Logger('APP');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () => {
    logger.log(`Server is running on PORT ${PORT} ⛱`);
  });
}
bootstrap();
