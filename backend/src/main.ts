import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { seedDb } from "./database/seed";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  seedDb();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
