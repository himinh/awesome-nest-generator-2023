import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { Public } from "~decorators/public.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { ParseObjectIdPipe } from "~utils/parse-object-id.pipe";

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
import { ApiTags } from "@nestjs/swagger";

import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { ConversationService } from "./conversation.service";
import { CreateConversationDto } from "./dto/create-conversation.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";

@ApiTags("Conversations")
@Controller("categories")
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	@Public()
	@Get()
	@HttpCode(HttpStatus.OK)
	async findMany(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.conversationService.findMany(filter, options);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() body: CreateConversationDto) {
		return this.conversationService.create(body);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateConversationDto,
	) {
		return this.conversationService.updateById(id, body);
	}

	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.conversationService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.conversationService.deleteById(id);
	}

	@Public()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(@GetAqp() { filter, ...options }: PaginationDto) {
		return this.conversationService.paginate(filter, options);
	}

	@Public()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.conversationService.count(filter);
	}

	@Public()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
	) {
		return this.conversationService.findById(id, { projection, populate });
	}
}
