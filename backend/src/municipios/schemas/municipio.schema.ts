import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MunicipioDocument = HydratedDocument<Municipio>;

@Schema()
export class Municipio {
    @Prop({ required: true, trim: true })
    codigo: string;

    @Prop({ required: true, trim: true })
    nombre: string;

    @Prop({ required: true, trim: true })
    provincia: string;
}

export const MunicipioSchema = SchemaFactory.createForClass(Municipio);
