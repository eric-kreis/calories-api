import { PartialType } from '@nestjs/mapped-types';
import { CreateEntryDTO } from './create-entry.dto';

export class UpdateEntryDTO extends PartialType(CreateEntryDTO) {}
