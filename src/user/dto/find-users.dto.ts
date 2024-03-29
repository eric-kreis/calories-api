import { PaginationDTO } from '@dtos/pagination.dto';
import { Prisma, Roles } from '@prisma/client';
import {
  IsIn,
  IsNotIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindUsersDTO extends PaginationDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsIn(Object.keys(Roles))
  @IsOptional()
  role?: keyof typeof Roles;

  @IsIn(Object.keys(Prisma.UserScalarFieldEnum))
  @IsNotIn([Prisma.UserScalarFieldEnum.password])
  @IsOptional()
  orderBy: Exclude<Prisma.UserScalarFieldEnum, 'password'> = Prisma.UserScalarFieldEnum.createdAt;

  @IsIn(Object.keys(Prisma.SortOrder))
  @IsOptional()
  order: Prisma.SortOrder = Prisma.SortOrder.desc;
}
