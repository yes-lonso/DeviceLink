import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Municipio } from '../../municipios/schemas/municipio.schema';
import { HydratedDocument } from 'mongoose';
export type SedeDocument = HydratedDocument<Sede>;



@Schema()
export class Sede {
    @Prop({ required: true })
    nombre: string;

    @Prop({ type: Types.ObjectId, ref: Municipio.name, required: true })
    municipio: Municipio;
}

export const SedeSchema = SchemaFactory.createForClass(Sede);
