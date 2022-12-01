import { PaginationDTO } from '@dtos/pagination.dto';
import { Prisma } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindEntriesDTO extends PaginationDTO {
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @IsBoolean()
  @IsOptional()
  lessThanExpected?: boolean;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsIn(Object.keys(Prisma.EntryScalarFieldEnum))
  @IsOptional()
  orderBy: Prisma.EntryScalarFieldEnum = Prisma.EntryScalarFieldEnum.createdAt;

  @IsIn(Object.keys(Prisma.SortOrder))
  @IsOptional()
  order: Prisma.SortOrder = Prisma.SortOrder.desc;
}
