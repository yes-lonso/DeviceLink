import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { Sede, SedeDocument } from './schemas/sede.schema';
import { BusquedaSedeDto } from './dto/busqueda-sede.dto';
import { SedeRespuestaDto } from './dto/sede-respuesta.dto';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Injectable()
export class SedesService {
   constructor(@InjectModel(Sede.name) private sedeModel: Model<SedeDocument>) {}

   async consultarSedes(): Promise<SedeRespuestaDto[]> {
      const resultados = await this.sedeModel
         .find()
         .populate({ path: 'municipio', populate: { path: 'provincia' } })
         .lean()
         .exec();
      return plainToInstance(SedeRespuestaDto, resultados, {
         excludeExtraneousValues: true,
      });
   }

   async crearSede(createSedeDto: CreateSedeDto): Promise<SedeRespuestaDto> {
      const nuevaSede = new this.sedeModel({
         ...createSedeDto,
      });
      const resultado = await nuevaSede.save();
      return plainToInstance(SedeRespuestaDto, resultado.toObject(), {
         excludeExtraneousValues: true,
      });
   }

   async actualizarSede(id: string, updateSedeDto: UpdateSedeDto): Promise<SedeRespuestaDto> {
      const resultado = await this.sedeModel
         .findByIdAndUpdate(id, updateSedeDto, { new: true })
         .lean()
         .exec();
      return plainToInstance(SedeRespuestaDto, resultado, {
         excludeExtraneousValues: true,
      });
   }

   async eliminarSede(id: string): Promise<void> {
      await this.sedeModel.findByIdAndDelete(id).exec();
   }
}
