import { PartialType } from '@nestjs/mapped-types';
import { Roles } from '@prisma/client';
import { IsIn, IsOptional } from 'class-validator';
import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
  @IsIn(Object.keys(Roles))
  @IsOptional()
  role?: keyof typeof Roles;
}
