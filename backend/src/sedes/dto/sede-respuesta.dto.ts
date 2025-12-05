import { Expose, Type, Transform } from 'class-transformer';

class ProvinciaRespuesta {
   @Expose()
   @Transform(({ obj }) => obj._id?.toString())
   id: string;

   @Expose()
   nombre: string;
}

class MunicipioRespuesta {
   @Expose()
   @Transform(({ obj }) => obj._id?.toString())
   id: string;

   @Expose()
   codigo: string;

   @Expose()
   nombre: string;

   @Expose()
   @Type(() => ProvinciaRespuesta)
   provincia: ProvinciaRespuesta;
}

export class SedeRespuestaDto {
   @Expose()
   @Transform(({ obj }) => obj._id?.toString())
   id: string;

   @Expose()
   nombre: string;

   @Expose()
   @Type(() => MunicipioRespuesta)
   municipio: MunicipioRespuesta;
}
