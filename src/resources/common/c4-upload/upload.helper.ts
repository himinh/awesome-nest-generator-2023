import { existsSync } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class UploadHelper {
  private uploadDir: string;
  constructor() {
    this.uploadDir = join(__dirname, '../../../../', 'public');
  }

  /**
   * Get file realpath exist
   *
   * @param filePath
   */
  async getRealpathOfFile(filePath: string) {
    const file = join(this.uploadDir, filePath);

    // check file path valid
    if (!existsSync(file)) throw new NotFoundException('File not found');

    return file;
  }
}
