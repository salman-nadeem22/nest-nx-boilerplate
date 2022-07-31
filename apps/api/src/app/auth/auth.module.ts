import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { projectConstants } from '@do-business/constants';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RefreshStrategy } from './refresh.strategy';
import { ResetStrategy } from './reset.strategy';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ClientsModule.registerAsync([
      {
        name: projectConstants.ServicesClient.AUTH,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin@localhost:5682 ').split(' '),
              queue: projectConstants.ServicesClient.AUTH,
              noAck: true,
              queueOptions: {
                durable: false,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BasicStrategy, RefreshStrategy, ResetStrategy],
  exports: [AuthService],
})
export class AuthModule {}
