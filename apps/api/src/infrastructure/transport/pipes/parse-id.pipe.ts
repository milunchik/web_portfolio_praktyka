import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ERROR_CODES } from '../../../shared/errors';

const CUID_REGEX = /^c[a-z0-9]{24}$/i;

@Injectable()
export class ParseIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!value || !CUID_REGEX.test(value)) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid id format',
        details: { value },
      });
    }

    return value;
  }
}
