import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { Provincia, ProvinciaDocument } from './schemas/provincia.schema';
import { Municipio, MunicipioDocument } from './schemas/municipio.schema';
import { BusquedaMunicipioDto } from './dto/busqueda-municipio.dto';
import { MunicipioRespuestaDto } from './dto/municipio-respuesta.dto';
import { ProvinciaRespuestaDto } from './dto/provincia-respuesta.dto';

@Injectable()
export class MunicipiosService {
   constructor(
      @InjectModel(Provincia.name) private provinciaModel: Model<ProvinciaDocument>,
      @InjectModel(Municipio.name) private municipioModel: Model<MunicipioDocument>,
   ) {}

   async subirMunicipios(file: Express.Multer.File) {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const provinciaOps: any[] = [];
      const municipioOps: any[] = [];
      let totalMunicipios = 0;

      console.log(`Procesando ${workbook.SheetNames.length} pestañas...`);

      for (const sheetName of workbook.SheetNames) {
         const sheet = workbook.Sheets[sheetName];
         const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
         const provinciaNombre = rawRows[1] ? rawRows[1][0] : sheetName;
         const headerRowIndex = rawRows.findIndex((row) => row && row.includes('CPRO'));

         if (headerRowIndex === -1) {
            console.warn(`No se encontró la cabecera CPRO en la pestaña ${sheetName}, saltando...`);
            continue;
         }

         const data = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });
         const municipios = data
            .map((row: any) => {
               if (!row.CPRO || !row.CMUN) return null;
               const cpro = String(row.CPRO).padStart(2, '0');
               const cmun = String(row.CMUN).padStart(3, '0');
               return {
                  codigo: cpro + cmun,
                  nombre: row.NOMBRE,
                  provincia: provinciaNombre, // Guardamos el nombre de la provincia directamente
               };
            })
            .filter((m) => m !== null);

         if (municipios.length === 0) continue;

         const provinciaCodigo = String(data[0]['CPRO']).padStart(2, '0');

         // Operación para Provincia
         provinciaOps.push({
            updateOne: {
               filter: { codigo: provinciaCodigo },
               update: {
                  $set: {
                     codigo: provinciaCodigo,
                     nombre: provinciaNombre,
                  },
               },
               upsert: true,
            },
         });

         // Operaciones para Municipios se harán después de guardar provincias
         // para asegurar que tenemos los IDs

         totalMunicipios += municipios.length;
      }

      console.log(`Guardando ${provinciaOps.length} provincias...`);

      if (provinciaOps.length > 0) {
         await this.provinciaModel.bulkWrite(provinciaOps);
      }

      // Recuperar todas las provincias para mapear código -> _id
      const provincias = await this.provinciaModel.find().lean().exec();
      const provinciaMap = new Map(provincias.map((p) => [p.codigo, p._id]));

      console.log(`Procesando municipios con mapa de ${provinciaMap.size} provincias...`);

      // Re-procesar para crear operaciones de municipios con ID de provincia
      for (const sheetName of workbook.SheetNames) {
         const sheet = workbook.Sheets[sheetName];
         const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
         const headerRowIndex = rawRows.findIndex((row) => row && row.includes('CPRO'));

         if (headerRowIndex === -1) continue;

         const data = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });
         const provinciaCodigo = String(data[0]['CPRO']).padStart(2, '0');
         const provinciaId = provinciaMap.get(provinciaCodigo);

         if (!provinciaId) {
            console.warn(
               `Provincia con código ${provinciaCodigo} no encontrada en base de datos, saltando municipios...`,
            );
            continue;
         }

         const municipios = data
            .map((row: any) => {
               if (!row.CPRO || !row.CMUN) return null;
               const cpro = String(row.CPRO).padStart(2, '0');
               const cmun = String(row.CMUN).padStart(3, '0');
               return {
                  codigo: cpro + cmun,
                  nombre: row.NOMBRE,
                  provincia: provinciaId, // Usamos el ObjectId
               };
            })
            .filter((m) => m !== null);

         municipios.forEach((m) => {
            municipioOps.push({
               updateOne: {
                  filter: { codigo: m.codigo },
                  update: { $set: m },
                  upsert: true,
               },
            });
         });

         totalMunicipios += municipios.length;
      }

      console.log(`Guardando ${municipioOps.length} municipios...`);

      if (municipioOps.length > 0) {
         await this.municipioModel.bulkWrite(municipioOps);
      }

      return { message: 'Archivo procesado correctamente', count: totalMunicipios };
   }

   async buscarProvincias(): Promise<ProvinciaRespuestaDto[]> {
      const provincias = await this.provinciaModel.find().sort({ codigo: 1 }).lean().exec();
      return plainToInstance(ProvinciaRespuestaDto, provincias, {
         excludeExtraneousValues: true,
      });
   }

   async consultarMunicipios(id: string): Promise<MunicipioRespuestaDto[]> {
      const provincia = new Types.ObjectId(id);
      const municipios = await this.municipioModel
         .find({ provincia })
         .populate('provincia')
         .lean()
         .exec();
      return plainToInstance(MunicipioRespuestaDto, municipios, {
         excludeExtraneousValues: true,
      });
   }

   async buscarMunicipios(busquedaDto: BusquedaMunicipioDto): Promise<MunicipioRespuestaDto[]> {
      const { valor } = busquedaDto;
      if (!valor) return [];

      const regex = new RegExp(valor, 'i');

      const resultados = await this.municipioModel
         .find({
            $or: [{ nombre: { $regex: regex } }, { codigo: { $regex: regex } }],
         })
         .populate('provincia')
         .lean()
         .exec();

      return plainToInstance(MunicipioRespuestaDto, resultados, {
         excludeExtraneousValues: true,
      });
   }
}
