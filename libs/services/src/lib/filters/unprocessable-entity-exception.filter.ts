import { Catch, ExceptionFilter, HttpStatus, UnprocessableEntityException } from '@nestjs/common';

type responseUnprocessableEntity = {
  status: 'INVALID';
  statusCode: HttpStatus;
  errors: any;
};

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: UnprocessableEntityException) {
    const ERROR: responseUnprocessableEntity = {
      status: 'INVALID',
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: exception.getResponse()['message'],
    };
    return ERROR;
  }
}
