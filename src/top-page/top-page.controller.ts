import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TopPageModel } from './top-page.model/top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import {
  TOP_PAGE_ALREADY_EXISTS,
  TOP_PAGE_DELETED,
  TOP_PAGE_NOT_FOUND,
} from './top-page.constants';

@UsePipes(new ValidationPipe())
@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    const { alias } = dto;
    const foundPage = await this.topPageService.getByAlias(alias);

    if (foundPage) {
      throw new BadRequestException(TOP_PAGE_ALREADY_EXISTS);
    }

    return this.topPageService.create(dto);
  }

  @Get('getAll')
  async getAll() {
    return this.topPageService.getAll();
  }

  @Get('getById/:id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const page = await this.topPageService.getById(id);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return page;
  }

  @Get('getByAlias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const page = await this.topPageService.getByAlias(alias);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return page;
  }

  @Delete('delete/:id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.delete(id);

    if (!deletedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return { message: TOP_PAGE_DELETED, status: 200 };
  }

  @Patch('update/:id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const updatedPage = await this.topPageService.update(id, dto);

    if (!updatedPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return updatedPage;
  }

  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {
    const pages = await this.topPageService.findByCategory(dto.firstCategory);

    if (!pages.length) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }

    return pages;
  }
}
