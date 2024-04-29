import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Types } from "mongoose";
import { UploadedResult } from "~modules/pre-built/7-uploads/types/upload.result.type";
@Injectable()
export class EventEmitterService {
	constructor(private eventEmitter: EventEmitter2) {}

	emitFileUploaded(files: UploadedResult[], userId: Types.ObjectId) {
		return this.eventEmitter.emit("file.uploaded", files, userId);
	}
}