import { Logger } from '@nestjs/common';

export function PrintLog() {
  return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
    const className = target.constructor.name;
    const original = descriptor.value;
    descriptor.value = new Proxy(original, {
      apply: async function (target, thisArg, args) {
        if (process.env.NODE_ENV == 'production') return target.apply(thisArg, args);
        Logger.debug(`${methodName} [🏁]`, className);
        try {
          const result = await target.apply(thisArg, args);
          Logger.debug(`${methodName} [✅]`, className);
          return result;
        } catch (error) {
          Logger.error(`${methodName} [❌]`, className);
          Logger.error(error.stack);
          throw error;
        }
      },
    });
  };
}
