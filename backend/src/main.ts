import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { FirebaseAuthGuard } from './common/guards/firebase-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger setup at /api
  const config = new DocumentBuilder()
    .setTitle('SlotReserve API')
    .setDescription('API documentation for SlotReserve backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Register global FirebaseAuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new FirebaseAuthGuard(reflector));

  await app.listen(process.env.PORT ?? 3000);
  // Fix CORS issues
}
bootstrap();

// TODO: Integrate TS-REST handler setup here
