import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateSedeDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsMongoId()
    @IsNotEmpty()
    municipio: string;
}
