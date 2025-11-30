import { Expose, Transform } from 'class-transformer';

export class MunicipioRespuestaDto {
    @Expose()
    @Transform(({ obj }) => obj._id?.toString())
    id: string;

    @Expose()
    nombre: string;

    @Expose()
    codigo: string;

    @Expose()
    provincia: string;
}
