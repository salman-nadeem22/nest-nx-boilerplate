/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, PipeTransform, ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) throw new UnprocessableEntityException(await this.formatErrors(errors));

    return classToPlain(object);
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private async formatErrors(err: ValidationError[]): Promise<any> {
    const errors = {};

    err.forEach(async (ee) => {
      if (!ee.children || !ee.children.length) errors[ee.property] = { constraints: ee.constraints };
      else errors[ee.property] = await this.formatErrors(ee.children);
    });

    return [errors];
  }
}
