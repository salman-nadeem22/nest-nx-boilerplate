import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Do Business API')
    .setDescription(
      'API Documentation.'
    )
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document, { swaggerOptions: { persistAuthorization: true } });
}
