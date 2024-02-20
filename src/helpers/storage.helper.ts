/* eslint-disable */
import { BadRequestException } from '@nestjs/common';

/**
 * Edit file name
 *
 * @param req
 * @param file
 * @param cb
 */
export const editFileName = (req: any, file: any, cb: any) => {
	const randomNamePre = Array(24)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join("");

	const fileExt = file.originalname.split(".").pop();

	cb(null, `${Date.now()}-${randomNamePre}.${fileExt}`);
};

/**
 * Image file filter
 *
 * @param extAllowed
 * @param req
 * @param file
 * @param callback
 * @returns
 */
export const fileFilterValidator = (
	req: any,
	file: any,
	callback: any,
	extAllowed?: string,
) => {
	const expression = `.(${"jpg"})$`;

	// check allow file
	if (file.originalname.match(new RegExp(expression))) {
		return callback(null, true);
	}

	return callback(new BadRequestException("Format files are allowed!"), false);
};

export const generateFileName = (file: Express.Multer.File) => {
	const randomNamePre = Array(24)
		.fill(null)
		.map(() => Math.round(Math.random() * 16).toString(16))
		.join("");

	return `${Date.now()}-${randomNamePre}-${file.originalname}`;
};

export const getFileExtension = (originalname: string): string => {
	return originalname.split(".").pop()?.toLowerCase() || "";
};
