import { IsString, IsNotEmpty } from 'class-validator';

export class BusquedaMunicipioDto {
    @IsString()
    @IsNotEmpty()
    valor: string;
}
