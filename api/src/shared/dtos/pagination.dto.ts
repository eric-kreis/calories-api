import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsNumber()
  @IsOptional()
  page: number = 0;

  @IsNumber()
  @IsOptional()
  count: number = 10;
}
