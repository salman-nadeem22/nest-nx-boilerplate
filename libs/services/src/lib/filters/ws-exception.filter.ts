import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    host.getClient().send({ message: exception.message, errors: exception.error });
  }
}
