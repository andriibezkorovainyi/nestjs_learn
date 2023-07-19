import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileResponseElementDto } from './dto/file-response-element.dto';
import { FilesService } from './files.service';
import { Mfile } from './dto/mfile-class';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('files'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseElementDto[]> {
    const saveArray = [new Mfile(file)];

    if (file.mimetype.includes('image')) {
      const webP = await this.filesService.convertToWebP(file.buffer);
      saveArray.push(
        new Mfile({
          originalname: `${file.originalname.split('.')[0]}.webp`,
          buffer: webP,
        }),
      );
    }

    return this.filesService.saveFile(saveArray);
  }
}
