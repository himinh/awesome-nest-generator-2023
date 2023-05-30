import { ObjectId } from 'mongodb';
import { GetAqp } from '~decorators/get-aqp.decorator';
import { AqpDto } from '~dto/aqp.dto';
import { ParseObjectIdPipe } from '~pipe/parse-object-id.pipe';

import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { TokenService } from './token.service';
import { Public } from '~decorators/public.decorator';

@ApiTags('Tokens')
@Controller('tokens')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Public()
  @Get('')
  async find(@GetAqp() { filter, ...options }: AqpDto) {
    return this.tokenService.find(filter, options);
  }

  @Delete(':ids/ids')
  async deleteManyByIds(@Param('ids') ids: string) {
    return this.tokenService.deleteMany({
      _id: { $in: ids.split(',') },
    });
  }

  @Delete(':id')
  async delete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.tokenService.deleteById(id);
  }

  @Public()
  @Get('paginate')
  async paginate(@GetAqp() { filter, ...options }: AqpDto) {
    return this.tokenService.paginate(filter, options);
  }

  @Public()
  @Get('count')
  async count(@GetAqp('filter') filter: AqpDto) {
    return this.tokenService.count(filter);
  }

  @Public()
  @Get(':id')
  async findOneById(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @GetAqp() { projection, populate }: AqpDto,
  ) {
    return this.tokenService.findById(id, { projection, populate });
  }
}
