import { Types } from "mongoose";
import { GetAqp } from "~decorators/get-aqp.decorator";
import { GetLanguage } from "~decorators/language.decorator";
import { PaginationDto } from "~dto/pagination.dto";
import { LanguageEnum } from "~enums/language.enum";
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
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { stringIdToObjectId } from "~utils/stringId_to_objectId";
import { CreateNotificationDto } from "./dto/create-notification.dto";
import { UpdateNotificationDto } from "./dto/update-notification.dto";
import { NotificationService } from "./notification.service";

@ApiTags("Notifications")
@Controller("notifications")
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	//  ----- Method: GET -----
	@ApiBearerAuth()
	@Get("paginate")
	@HttpCode(HttpStatus.OK)
	async paginate(
		@GetAqp() { filter, ...options }: PaginationDto,
		@GetLanguage() language: LanguageEnum,
	) {
		const pagination = await this.notificationService.paginate(filter, options);

		pagination.docs.forEach((item) => {
			this.notificationService.addNotificationDetail(item, language);
		});

		return pagination;
	}

	@ApiBearerAuth()
	@Get("count")
	@HttpCode(HttpStatus.OK)
	async count(@GetAqp("filter") filter: PaginationDto) {
		return this.notificationService.count(filter);
	}

	@ApiBearerAuth()
	@Get(":id")
	@HttpCode(HttpStatus.OK)
	async findOneById(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@GetAqp() { projection, populate }: PaginationDto,
		@GetLanguage() language: LanguageEnum,
	) {
		const notification = await this.notificationService.findById(id, {
			projection,
			populate,
		});

		if (notification)
			// add notification detail
			this.notificationService.addNotificationDetail(notification, language);

		return notification;
	}

	//  ----- Method: POST -----
	@HttpCode(HttpStatus.CREATED)
	@ApiBearerAuth()
	@Post()
	async create(@Body() body: CreateNotificationDto) {
		return this.notificationService.createNotification(body);
	}

	//  ----- Method: PATCH -----
	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	async update(
		@Param("id", ParseObjectIdPipe) id: Types.ObjectId,
		@Body() body: UpdateNotificationDto,
	) {
		return this.notificationService.updateById(id, body);
	}

	//  ----- Method: DELETE -----
	@Delete(":ids/ids")
	@HttpCode(HttpStatus.OK)
	async deleteManyByIds(@Param("ids") ids: string) {
		return this.notificationService.deleteMany({
			_id: { $in: ids.split(",").map(stringIdToObjectId) },
		});
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	async delete(@Param("id", ParseObjectIdPipe) id: Types.ObjectId) {
		return this.notificationService.deleteById(id);
	}
}
