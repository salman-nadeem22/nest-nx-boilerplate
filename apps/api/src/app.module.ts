import {Module,} from '@nestjs/common';
import {UsersModule} from './app/users/users.module';
import {AuthModule} from './app/auth/auth.module';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {TransformInterceptor} from './common/transform.interceptor';

@Module({
  imports: [
    UsersModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
}
