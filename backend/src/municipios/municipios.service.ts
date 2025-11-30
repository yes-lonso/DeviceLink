import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as XLSX from 'xlsx';
import { plainToInstance } from 'class-transformer';
import { Provincia, ProvinciaDocument } from './schemas/provincia.schema';
import { BusquedaMunicipioDto } from './dto/busqueda-municipio.dto';
import { MunicipioRespuestaDto } from './dto/municipio-respuesta.dto';
import { ProvinciaRespuestaDto } from './dto/provincia-respuesta.dto';

@Injectable()
export class MunicipiosService {
    constructor(@InjectModel(Provincia.name) private provinciaModel: Model<ProvinciaDocument>) { }

    async subirMunicipios(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const operations: any[] = [];
        let totalMunicipios = 0;

        console.log(`Procesando ${workbook.SheetNames.length} pestañas...`);

        for (const sheetName of workbook.SheetNames) {
            const sheet = workbook.Sheets[sheetName];

            // Obtener el nombre de la provincia de la fila 1 (índice 1)            
            const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

            // Suponemos que la fila 1 contiene el nombre de la provincia en la primera celda            
            const provinciaNombre = rawRows[1] ? rawRows[1][0] : sheetName;

            // Buscamos la fila con la cabecera CPRO
            const headerRowIndex = rawRows.findIndex(row => row && row.includes('CPRO'));

            if (headerRowIndex === -1) {
                console.warn(`No se encontró la cabecera CPRO en la pestaña ${sheetName}, saltando...`);
                continue;
            }

            // Obtenemos los municipios
            const data = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });

            const municipios = data.map((row: any) => {
                if (!row.CPRO || !row.CMUN) return null;

                const cpro = String(row.CPRO).padStart(2, '0');
                const cmun = String(row.CMUN).padStart(3, '0');

                return {
                    codigo: cpro + cmun,
                    nombre: row.NOMBRE,
                    provincia: cpro
                };
            }).filter(m => m !== null);

            if (municipios.length === 0) continue;

            // Operación de creación por cada provincia
            // Se usa el CPRO del primer municipio como código de provincia
            const provinciaCodigo = municipios[0].provincia;

            operations.push({
                updateOne: {
                    filter: { codigo: provinciaCodigo },
                    update: {
                        $set: {
                            codigo: provinciaCodigo,
                            nombre: provinciaNombre,
                            municipios: municipios
                        }
                    },
                    upsert: true
                }
            });

            totalMunicipios += municipios.length;
        }

        console.log(`Guardando ${operations.length} provincias con un total de ${totalMunicipios} municipios...`);

        if (operations.length > 0) {
            await this.provinciaModel.bulkWrite(operations);
        }

        return { message: 'Archivo procesado correctamente', count: totalMunicipios };
    }

    async buscarProvincias(): Promise<ProvinciaRespuestaDto[]> {
        const provincias = await this.provinciaModel.find().select({ municipios: 0 }).sort({ codigo: 1 }).lean().exec();
        return plainToInstance(ProvinciaRespuestaDto, provincias, {
            excludeExtraneousValues: true,
        });
    }

    async buscarProvinciaPorCodigo(codigo: string): Promise<ProvinciaRespuestaDto> {
        const provincia = await this.provinciaModel.findOne({ codigo }).lean().exec();
        if (!provincia) return null;
        return plainToInstance(ProvinciaRespuestaDto, provincia, {
            excludeExtraneousValues: true,
        });
    }

    async buscarMunicipios(busquedaDto: BusquedaMunicipioDto): Promise<MunicipioRespuestaDto[]> {
        const { valor } = busquedaDto;
        if (!valor) return [];

        const regex = new RegExp(valor, 'i'); // Expresión regular insensible a mayúsculas/minúsculas

        const resultados = await this.provinciaModel.aggregate([
            // Descomponer el array de municipios para tratar cada uno como un documento
            { $unwind: '$municipios' },
            // Filtrar municipios por nombre o código
            {
                $match: {
                    $or: [
                        { 'municipios.nombre': { $regex: regex } },
                        { 'municipios.codigo': { $regex: regex } }
                    ]
                }
            },
            // Proyectar los campos deseados (aplanar la estructura)
            {
                $project: {
                    _id: '$municipios._id',
                    nombre: '$municipios.nombre',
                    codigo: '$municipios.codigo',
                    provincia: '$nombre' // Usar el nombre de la provincia del documento padre
                }
            },
            // imitar resultados para evitar saturar al cliente
            { $limit: 100 }
        ]).exec();

        return plainToInstance(MunicipioRespuestaDto, resultados, {
            excludeExtraneousValues: true,
        });
    }
}
