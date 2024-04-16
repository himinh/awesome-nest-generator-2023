import { GetCurrentUserId } from "~decorators/get-current-user-id.decorator";

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";

import { UserFileService } from "../7-user-files/user-file.service";
import { UploadedError } from "./types/upload.error.type";
import { UploadedResult } from "./types/upload.result.type";
import { UploadService } from "./upload.service";

@Controller("uploads")
export class UploadController {
	constructor(
		private readonly uploadService: UploadService,
		private readonly userFileService: UserFileService,
	) {}

	@Post()
	@UseInterceptors(FilesInterceptor("files", 10))
	@HttpCode(HttpStatus.CREATED)
	async uploadFiles(
		@GetCurrentUserId() userId: string,
		@Body() body: Record<string, string>,
		@UploadedFiles()
		inputs: Array<Express.Multer.File>,
	) {
		// upload files
		const filesUploaded = await Promise.all(
			inputs.map((file) => this.uploadService.uploadFile(file)),
		);

		console.log({ body });

		return this._handleSaveFileUploaded(filesUploaded, userId);
	}

	// Handle the results of file uploads
	private _handleSaveFileUploaded(
		filesUploaded: (UploadedResult | UploadedError)[],
		userId: string,
	) {
		const results: Record<string, any>[] = [];
		const fileItems: Record<string, any>[] = [];

		for (const file of filesUploaded) {
			if (file.isUploadedSuccess) {
				const res = file as UploadedResult;

				results.push({
					originalname: res.originalname,
					fileSize: res.fileSize,
					files: res.files,
				});

				// Add the uploaded file to the fileItems array
				fileItems.push({ ...res, userId });
			} else results.push(file);
		}

		// save files
		this.userFileService.createMany(fileItems).catch();

		return { results, fileItems };
	}
}
