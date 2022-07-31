import { RequestTimeoutException, HttpException } from '@nestjs/common';
import { timeout, catchError, concatMap, pluck } from 'rxjs/operators';
import { TimeoutError, throwError, lastValueFrom } from 'rxjs';
import { ClientRMQ } from '@nestjs/microservices';

export function FetchData(client) {
  return async (COMMAND: { cmd: string; role: string }, args: any = {}): Promise<any> => {
    return lastValueFrom(
      client.send(COMMAND, args).pipe(
        timeout(5000),
        pluck('response'),
        concatMap(({ status = 'SUCCESS', ok, ...res }) => {
          switch (status) {
            case 'SUCCESS':
              return typeof ok !== 'undefined' ? Promise.resolve(ok) : Promise.resolve({ ...res });
            default:
              return throwError(() => new HttpException({ ...res, status: res.statusCode === 422 ? 'INVALID' : 'FAILED' }, res.statusCode));
          }
        }),
        catchError((err) => throwError(() => (err instanceof TimeoutError ? new RequestTimeoutException() : err)))
      )
    );
  };
}

export function EmitData(client: ClientRMQ) {
  return async (COMMAND: { cmd: string; role: string }, args: any = {}): Promise<any> => {
    return new Promise((res, rej) => {
      try {
        return res(client.emit(COMMAND, args));
      } catch (error) {
        return rej(error);
      }
    });
  };
}

export function FetchIOData(client: ClientRMQ) {
  return async (COMMAND: { cmd: string; role: string }, args: any): Promise<any> => {
    return lastValueFrom(
      client.send(COMMAND, args).pipe(
        timeout(5000),
        pluck('response'),
        concatMap((res) => Promise.resolve(res)),
        catchError((err) => throwError(() => (err instanceof TimeoutError ? new Error('Timeout') : err)))
      )
    );
  };
}

export function FetchObject(client) {
  return async (COMMAND: { cmd: string; role?: string }, args: any = {}): Promise<any> => {
    return lastValueFrom(
      client.send(COMMAND, args).pipe(
        timeout(5000),
        pluck('response'),
        concatMap((res) => Promise.resolve(res)),
        catchError((err) => throwError(() => (err instanceof TimeoutError ? new RequestTimeoutException() : err)))
      )
    );
  };
}
