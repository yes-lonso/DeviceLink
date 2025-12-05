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
   @Transform(({ value }) => {
      if (typeof value === 'object' && value !== null && 'nombre' in value) {
         return value.nombre;
      }
      return value; // Devuelve el ID si no está poblado
   })
   provincia: string;
}


