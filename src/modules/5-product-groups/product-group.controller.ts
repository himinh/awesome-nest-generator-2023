import { Types } from "mongoose";
import { ParseObjectIdPipe } from "src/utils/parse-object-id.pipe";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { stringIdToObjectId } from "src/utils/stringId_to_objectId";
import { CreateProductGroupDto } from "./dto/create-product-group.dto";
import { UpdateProductGroupDto } from "./dto/update-product-group.dto";
import { ProductGroupService } from "./product-group.service";

@ApiTags("Product Groups")
@Controller("product_groups")
export class ProductGroupController {
	constructor(private readonly productGroupService: ProductGroupService) {}

	// ----- Method: GET -----
	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.productGroupService.findMany(filter, options);
	}

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.productGroupService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.productGroupService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.productGroupService.findById(id, { projection, populate });
	}

	// ----- Method: POST -----
	@ApiBearerAuth()
	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateProductGroupDto) {
		return this.productGroupService.create(body);
	}

	// ----- Method: PATCH -----
	@ApiBearerAuth()
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateProductGroupDto,
	) {
		return this.productGroupService.updateById(id, body);
	}

	// ----- Method: DELETE -----
	@ApiBearerAuth()
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.productGroupService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@ApiBearerAuth()
	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.productGroupService.deleteById(id);
	}
}
