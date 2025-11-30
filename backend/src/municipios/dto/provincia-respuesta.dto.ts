import { Expose, Transform, Type } from 'class-transformer';
import { MunicipioRespuestaDto } from './municipio-respuesta.dto';

export class ProvinciaRespuestaDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    id: string;

    @Expose()
    nombre: string;

    @Expose()
    codigo: string;

    @Expose()
    @Type(() => MunicipioRespuestaDto)
    municipios: MunicipioRespuestaDto[];
}
