/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as aqp from 'api-query-params';

import { QueryParamsDto } from './query-params.dto';
import { queryParamValidatorDto } from './query-params.validator';

@Injectable()
export default class QueryParamsMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    // Remove key query projection by key: "fields" in API-Query-Params
    if (req.query.fields && (req.query.fields as string).includes('password')) {
      throw new BadRequestException('Fields cannot access passwords');
    }

    // Convert req.query to api-query-params
    // @ts-ignore
    const query: any = aqp(req.query, { skipKey: 'page' });

    // Validate params
    try {
      await queryParamValidatorDto(QueryParamsDto, query);
    } catch (e) {
      next(e);
    }

    // @ts-ignore
    req.aqp = query;
    next();
  }
}
