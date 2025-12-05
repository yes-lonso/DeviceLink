import { PartialType } from '@nestjs/mapped-types'; // Or @nestjs/swagger if used, but mapped-types is standard
import { CreateSedeDto } from './create-sede.dto';

export class UpdateSedeDto extends PartialType(CreateSedeDto) { }
