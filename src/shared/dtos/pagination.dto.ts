import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number = 0;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  count: number = 10;
}
