import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class ServiceTransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    let cmd = context.getArgs()[1].args[context.getArgs()[1].args.length - 1];
    cmd = JSON.parse(cmd).cmd;
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) {
          return {
            response: {
              message: data.message,
              statusCode: data['statusCode'] || data['status'] || 500,
              status: data['statusCode'] === 422 ? 'INVALID' : 'FAILED',
              error: `${data['error'] || data['response']['message']} >> ${cmd}-FAILED` || 'SERVER ERROR',
            },
          } as unknown as Response<T>;
        }
        return { response: data } as unknown as Response<T>;
      }),
      catchError(({ response }) => {
        if (response?.statusCode === 422)
          return Promise.resolve({
            response: {
              message: response.message,
              statusCode: response?.statusCode || 500,
              error: `${response.error} >> ${cmd} [FAILED].`,
              status: 'INVALID',
            },
          } as unknown as Response<T>);

        return Promise.resolve({
          response: {
            message: response.message || response,
            statusCode: response?.statusCode || 500,
            error: `${response.error} >> ${cmd}-FAILED` || 'SERVER ERROR',
            status: 'FAILED',
          },
        } as unknown as Response<T>);
      })
    );
  }
}
