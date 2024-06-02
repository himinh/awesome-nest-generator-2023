import {
	IsBoolean,
	IsMongoId,
	IsNumber,
	IsOptional,
	IsString,
} from "class-validator";
import { Types } from "mongoose";

export class CreateMenuDto {
	@IsOptional()
	@IsMongoId()
	readonly parentId?: Types.ObjectId;

	@IsOptional()
	@IsMongoId()
	readonly menuId?: Types.ObjectId;

	@IsOptional()
	@IsString()
	readonly name?: string;

	@IsOptional()
	@IsNumber()
	readonly position?: number;

	@IsOptional()
	@IsBoolean()
	readonly isHorizontal?: boolean;

	@IsOptional()
	@IsBoolean()
	readonly isShow?: boolean;
}
