import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Provincia } from './provincia.schema';

export type MunicipioDocument = HydratedDocument<Municipio>;

@Schema({ collection: 'municipios' })
export class Municipio {
    @Prop({ required: true, trim: true })
    codigo: string;

    @Prop({ required: true, trim: true })
    nombre: string;

    @Prop({ type: Types.ObjectId, ref: Provincia.name, required: true })
    provincia: Types.ObjectId;
}

export const MunicipioSchema = SchemaFactory.createForClass(Municipio);
