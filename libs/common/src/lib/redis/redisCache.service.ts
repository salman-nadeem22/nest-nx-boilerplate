import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async del(key: string) {
    return await this.cache.del(key);
  }

  async get(key: string) {
    return await this.cache.get(key);
  }

  async set(key: string, value: any) {
    return await this.cache.set(key, value);
  }

  async setTTL(key: string, value: any, ttl: number) {
    return await this.cache.set(key, value, { ttl: ttl + 1 });
  }
}
