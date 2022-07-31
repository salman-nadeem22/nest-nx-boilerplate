import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor() {}
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    request.body = {
      ...request.body,
      context: {
        params: request.params,
        query: request.query,
        user: request.user,
      },
    };

    const path = context.switchToHttp().getRequest().url;

    const timestamp = new Date().toISOString();
    return next.handle().pipe(
      map((data) => {
        if (data.error !== undefined) {
          delete data['response'];
          delete data['name'];
          throw new HttpException({ status: 'FAILED', ...data }, data['statusCode']);
        }
        const res = { statusCode: context.switchToHttp().getResponse().statusCode };
        res['status'] = 'SUCCESS';
        if (Array.isArray(data)) res['data'] = data;
        else res['payload'] = data;
        res['path'] = context.switchToHttp().getRequest().url;
        res['timestamp'] = new Date().toISOString();

        return res as Response<T>;
      }),

      catchError(async ({ response, status = 500 }) => {
        return Promise.reject(
          new HttpException(
            {
              status: status === 422 ? 'Invalid' : 'Failed',
              message: response.message,
              statusCode: response.statusCode,
              error: response.error,
              path,
              timestamp,
            },
            status
          )
        );
      })
    );
  }
}
