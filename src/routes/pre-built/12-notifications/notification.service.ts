import { PaginateModel } from "mongoose";
import { LanguageEnum } from "src/enums/language.enum";
import { BaseService } from "~base-inherit/base.service";

import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { CreateNotificationDto } from "./dto/create-notification.dto";
import { NotificationTypeEnum } from "./enums/noti-type.enum";
import {
	Notification,
	NotificationDocument,
} from "./schemas/notification.schema";
import { notificationTranslate } from "./trans/nottification.translate";

@Injectable()
export class NotificationService extends BaseService<NotificationDocument> {
	constructor(
		@InjectModel(Notification.name) model: PaginateModel<NotificationDocument>,
	) {
		super(model);
	}

	async createNotification(input: CreateNotificationDto) {
		switch (input.type) {
			case NotificationTypeEnum.Post:
				return this._createPostNotification(input);

			case NotificationTypeEnum.Comment:
				return this._createCommentNotification(input);

			default:
				throw new BadRequestException("Invalid notification type");
		}
	}

	addNotificationDetail(notification: any, language: LanguageEnum) {
		switch (notification.type) {
			case NotificationTypeEnum.Post:
				Object.assign(notification, {
					content: notificationTranslate.post.content[language],
				});

				break;

			case NotificationTypeEnum.Comment:
				Object.assign(notification, {
					content: notificationTranslate.comment.content(
						notification.senderId?.fullName,
					)[language],
				});

				break;
		}
	}

	private _createCommentNotification(input: CreateNotificationDto) {
		return this.create(input);
	}

	private _createPostNotification(input: CreateNotificationDto) {
		return this.create(input);
	}
}
