import { Types } from 'mongoose';
import { ApiQueryParams } from 'src/common/decorators/api-query-params.decorator';
import { ApiQueryParamsDto } from 'src/middlewares/dto';
import { dbCollections } from '~config/collections/schemas.collection';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TransactionService } from './transaction.service';

@ApiTags(dbCollections.transaction.path)
@Controller(dbCollections.transaction.path)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Find all docs
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('')
  async find(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.transactionService.find(queryParams);
  }

  /**
   * Paginate
   *
   * @param queryParams
   * @returns
   */
  @HttpCode(200)
  @Get('paginate')
  async paginate(@ApiQueryParams() queryParams: ApiQueryParamsDto) {
    return this.transactionService.paginate(queryParams);
  }

  /**
   * Count
   *
   * @param query
   * @returns
   */
  @HttpCode(200)
  @Get('count')
  async count(@Query() query: any) {
    return this.transactionService.count(query);
  }

  /**
   * Find by id
   *
   * @param id
   * @returns
   */
  @HttpCode(200)
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @ApiQueryParams() { population, projection }: ApiQueryParamsDto,
  ) {
    const result = await this.transactionService.findById(id, {
      population,
      projection,
    });

    if (!result) throw new NotFoundException('The item does not exist');

    return result;
  }

  /**
   * Create
   *
   * @param body
   * @returns
   */
  @HttpCode(201)
  @Post('')
  async create(@Body() body: any) {
    return this.transactionService.create(body);
  }

  /**
   * Update by ID
   *
   * @param id
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Put(':id')
  async update(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() body: any) {
    return this.transactionService.updateById(id, body);
  }

  /**
   * Delete many by ids
   *
   * @param ids
   * @returns
   */
  // @HttpCode(204)
  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.transactionService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  /**
   * Delete by ID
   *
   * @param id
   * @returns
   */
  // @HttpCode(204)
  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.transactionService.deleteById(id);
  }
}
