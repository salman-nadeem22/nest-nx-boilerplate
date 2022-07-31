import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { InvalidError } from './http-Invalid.response';

function getExceptionResponse(exception: HttpException): InvalidError {
  return exception.getResponse() as InvalidError;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = exception.getStatus();

    if (statusCode !== HttpStatus.UNPROCESSABLE_ENTITY) {
      return response.status(statusCode).json({
        statusCode,
        message: exception.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
    const exceptionResponse: InvalidError = getExceptionResponse(exception);
    response.status(statusCode).json({
      statusCode,
      status: exceptionResponse.status,
      error: exceptionResponse.error.message,
      message: exceptionResponse.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
