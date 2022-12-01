import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateEntryDTO {
  @IsDateString()
  @Transform(({ value }) => new Date(new Date(value).toDateString()).toISOString())
  date: Date;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsMilitaryTime()
  time: string;

  @IsNumber()
  @IsOptional()
  calories?: number;
}
