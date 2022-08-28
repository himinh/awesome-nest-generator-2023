import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { schemas } from '~config/collections/schemas.collection';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { localDiskStorage } from '~lazy-modules/storage/local-disk/local-disk.storage';
import { UploadService } from './upload.service';

@ApiTags(schemas.upload.path)
@Controller(schemas.upload.path)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Upload single file to tmp
   * @param file
   */
  @UseInterceptors(FileInterceptor('file', localDiskStorage))
  @HttpCode(201)
  @Post('file')
  async uploadFileToLocal(@UploadedFile() file: Express.Multer.File) {
    return { file: file.path.replace('public/', '') };
  }

  /**
   * Upload many files to tmp
   * @param files
   */
  @UseInterceptors(FilesInterceptor('files', 25, localDiskStorage))
  @HttpCode(201)
  @Post('files')
  async uploadFilesToLocal(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      files: files.map((file: any) => file.path.replace('public/', '')),
    };
  }

  /**
   * Save file to local disk
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-file-to-local')
  async saveFileToDisk(@Body() body: { file: string }) {
    return body;
  }

  /**
   * Save files to local disk
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-files-to-local')
  async saveFilesToLocal(@Body() body: { files: string[] }) {
    return body;
  }

  /**
   * Save file to s3
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-file-to-s3')
  async saveFileToS3(@Body() body: { file: string }) {
    return body;
  }

  /**
   * Save files to s3
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-files-to-s3')
  async saveFilesToS3(@Body() body: { files: string[] }) {
    return body;
  }

  /**
   * Save file to cloudinary
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-file-to-cloudinary')
  async saveFileToCloudinary(@Body() body: { file: string }) {
    return body;
  }

  /**
   * Save files to cloudinary
   * @param body
   * @returns
   */
  @HttpCode(200)
  @Post('save-files-to-cloudinary')
  async saveToCloudinary(@Body() body: { files: string[] }) {
    return body;
  }
}
