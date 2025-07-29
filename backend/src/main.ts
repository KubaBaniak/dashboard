import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { seedDb } from "./database/seed";

async function bootstrap() {
  seedDb();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
