import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPageModel, '_id'>) {
    return 'create';
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return 'get';
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return 'delete';
  }

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
    return 'patch';
  }

  @Post()
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {
    return 'find';
  }
}
