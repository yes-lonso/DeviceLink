import { Transform } from 'class-transformer';
import { Expose } from 'class-transformer';

export class ProvinciaRespuestaDto {
   @Expose()
   @Transform(({ obj }) => obj._id?.toString())
   id: string;

   @Expose()
   nombre: string;

   @Expose()
   codigo: string;
}