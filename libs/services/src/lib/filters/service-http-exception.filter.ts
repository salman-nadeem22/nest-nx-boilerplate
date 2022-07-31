import { Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

type HttpExceptionEntity = {
  status: 'INVALID' | 'FAILED';
  statusCode: HttpStatus;
  errors: any;
};

@Catch(HttpException)
export class ServiceHTTPExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const ERROR: HttpExceptionEntity = {
      status: 'INVALID',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: exception.getResponse()['message'],
    };
    return ERROR;
  }
}
