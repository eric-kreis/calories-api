import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AccessGuard } from '@guards/access.guard';
import { Authorize } from '@decorators/authorize.decorator';
import { Roles } from '@prisma/client';
import { EntryService } from './entry.service';
import { CreateEntryDTO } from './dto/create-entry.dto';
import { UpdateEntryDTO } from './dto/update-entry.dto';
import { FindEntriesDTO } from './dto/find-entries.dto';

@UseGuards(JwtAuthGuard, AccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Authorize(Roles.ADMIN, Roles.REGULAR)
@Controller('entries')
export class EntryController {
  constructor(private readonly _entryService: EntryService) {}

  @Post()
  public async create(
    @Body() data: CreateEntryDTO,
    @Request() req: Express.Request,
  ) {
    return this._entryService.create(data, req.user);
  }

  @Get()
  public async findAll(
    @Query() query: FindEntriesDTO,
    @Request() req: Express.Request,
  ) {
    return this._entryService.findAll(query, req.user);
  }

  @Get(':id')
  public async findOne(
    @Param('id') id: string,
    @Request() req: Express.Request,
  ) {
    return this._entryService.findOne(id, req.user);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateEntryDTO: UpdateEntryDTO,
    @Request() req: Express.Request,
  ) {
    return this._entryService.update(id, updateEntryDTO, req.user);
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: string,
    @Request() req: Express.Request,
  ) {
    return this._entryService.delete(id, req.user);
  }
}
