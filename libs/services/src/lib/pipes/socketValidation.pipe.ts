/* eslint-disable @typescript-eslint/ban-types */
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { WsException } from '@nestjs/websockets';

interface IValidationError {
  property: string;
  child?: undefined | IValidationError[];
  errors?: string[];
  constraints?: {
    [type: string]: string;
  };
}

function ChildParameterize(err: ValidationError[]) {
  const errs = [];
  err.forEach((child) => {
    const meta = { property: child.property };
    if (child.children?.length) {
      meta['child'] = ChildParameterize(child.children);
    } else {
      meta['errors'] = Object.keys(child.constraints);
    }
    errs.push(meta);
  });
  return err;
}

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (typeof value !== 'object') throw new WsException('Only JSON Object Accepted!');
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value || {});
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new WsException(await this.formatErrors(errors));
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private async formatErrors(errors: ValidationError[]): Promise<IValidationError[]> {
    return Promise.all(
      errors.map(async (err) => {
        const meta: IValidationError = { property: err.property };
        meta.constraints = err.constraints;
        if (err.children.length) {
          meta.child = ChildParameterize(err.children);
        } else {
          meta.errors = Object.keys(err.constraints);
          delete meta.child;
        }
        return meta;
      })
    );
  }
}
