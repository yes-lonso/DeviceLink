import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class BusquedaMunicipioDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2, { message: 'El valor de búsqueda debe tener al menos 2 caracteres' })
    valor: string;
}
