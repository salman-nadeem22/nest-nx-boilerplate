import { Injectable, PipeTransform } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';

function generateHash(f) {
  const fileBuffer = fs.readFileSync(f.path);
  const hashSum = crypto.createHash('md5');
  hashSum.update(fileBuffer);
  const md5 = hashSum.digest('hex');
  f['md5'] = md5;
  return f;
}
@Injectable()
export class MD5FILEPipe implements PipeTransform<any> {
  transform(file: any | any[]) {
    if (!file) return undefined;
    return Array.isArray(file) ? file.map(generateHash) : generateHash(file);
  }
}

@Injectable()
export class MD5_FIELDS_FILE_Pipe implements PipeTransform<any> {
  transform(files: any) {
    if (!files) return undefined;
    Object.entries(files).forEach(([fieldname, file]) => (files[fieldname] = Array.isArray(file) ? file.map(generateHash) : generateHash(file)));
    return files;
  }
}
