import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Municipio, MunicipioSchema } from './municipio.schema';

export type ProvinciaDocument = HydratedDocument<Provincia>;

@Schema()
export class Provincia {
    @Prop({ required: true, unique: true, trim: true })
    codigo: string;

    @Prop({ required: true, trim: true, index: true })
    nombre: string;

    @Prop({ type: [MunicipioSchema], default: [] })
    municipios: Municipio[];
}

export const ProvinciaSchema = SchemaFactory.createForClass(Provincia);
ProvinciaSchema.index({ 'municipios.nombre': 1, 'municipios.codigo': 1 });
