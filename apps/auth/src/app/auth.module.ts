import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { projectConstants} from '@do-business/constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from '@do-business/common';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST', '0.0.0.0'),
        port: configService.get<number>('REDIS_PORT', 6379),
        ttl: configService.get<number>('CACHE_TTL', 0),
      }),
    }),
    JwtModule.register({
      secret: projectConstants.AuthConstants.jwtSecret,
      signOptions: { expiresIn:  projectConstants.AuthConstants.jwtExpireAt },
    }),
    ClientsModule.registerAsync([
      {
        name: projectConstants.ServicesClient.USER,
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: configService.get<string>('RABBITMQ_URL', 'amqp://admin:admin@localhost:5682 ').split(' '),
              queue: projectConstants.ServicesClient.USER,
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
  providers: [AuthService, RedisCacheService],
})
export class AuthModule {}
