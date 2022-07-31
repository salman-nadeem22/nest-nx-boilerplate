/* eslint-disable @typescript-eslint/ban-types */
import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

function Parse(data) {
  if (!data) return null;
  if (typeof data !== 'object') {
    try {
      return JSON.parse(data);
    } catch (error) {
      return data;
    }
  } else {
    Object.keys(data).forEach((key) => (data[key] = Parse(data[key])));
    return data;
  }
}

@Injectable()
export class JSONParsePipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    return Parse(plainToClass(metatype, value));
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
