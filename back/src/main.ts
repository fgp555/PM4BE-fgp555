import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middleware/logger.middleware';
import { ProductSeederService } from './modules/products/product.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(loggerGlobal);

  // const productSeeder = app.get(ProductSeederService);
  // await productSeeder.seed();

  await app.listen(3000);
}
bootstrap();
