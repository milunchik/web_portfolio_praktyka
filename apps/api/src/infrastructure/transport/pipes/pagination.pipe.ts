import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PAGINATION } from '../../../shared/constants';
import { ERROR_CODES } from '../../../shared/errors';
import { RawPaginationQuery, PaginationParams } from '../../../shared/types/';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: RawPaginationQuery): PaginationParams {
    const page = Number(value?.page ?? PAGINATION.DEFAULT_PAGE);
    const limit = Number(value?.limit ?? PAGINATION.DEFAULT_LIMIT);

    if (!Number.isInteger(page) || page < 1) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid page parameter',
        details: { page },
      });
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > PAGINATION.MAX_LIMIT) {
      throw new BadRequestException({
        code: ERROR_CODES.BAD_REQUEST,
        message: 'Invalid limit parameter',
        details: { limit },
      });
    }

    return {
      page,
      limit,
      offset: (page - 1) * limit,
    };
  }
}
