import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './app/auth.module';
import { filters, interceptors, pipes } from '@do-business/services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
  providers: [
    { provide: APP_PIPE, useClass: pipes.ValidationPipe },
    { provide: APP_FILTER, useClass: filters.UnprocessableEntityExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: interceptors.ServiceTransformInterceptor,
    },
  ],
})
export class AppModule {}
