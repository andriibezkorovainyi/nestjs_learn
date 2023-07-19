import { Injectable } from '@nestjs/common';
import { FileResponseElementDto } from './dto/file-response-element.dto';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { Mfile } from './dto/mfile-class';

@Injectable()
export class FilesService {
  async saveFile(files: Mfile[]): Promise<FileResponseElementDto[]> {
    const dateFolder = format(new Date(), 'yyyy-MM-dd');
    const uploadFolder = `${path}/uploads/${dateFolder}`;
    await ensureDir(uploadFolder);
    const result: FileResponseElementDto[] = [];

    for (const file of files) {
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);
      result.push({
        url: `${dateFolder}/${file.originalname}`,
        name: file.originalname,
      });
    }

    return result;
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
