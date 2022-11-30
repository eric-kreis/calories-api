import { Express } from 'express';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@prisma/client';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { AccessGuard } from '@guards/access.guard';
import { Authorize } from '@decorators/authorize.decorator';
import { FindUsersDTO } from './dto/find-users.dto';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard, AccessGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Authorize(Roles.ADMIN, Roles.MANAGER)
  public async findAll(@Query() query: FindUsersDTO): Promise<UserEntity[]> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  public async findOne(@Param('id') id: string, @Request() req: Express.Request) {
    return this.userService.findOne(id, req.user);
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDTO: UpdateUserDTO,
    @Request() req: Express.Request,
  ) {
    return this.userService.update(id, updateUserDTO, req.user);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string, @Request() req: Express.Request) {
    return this.userService.delete(id, req.user);
  }
}
