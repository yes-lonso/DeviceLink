import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type ProvinciaDocument = HydratedDocument<Provincia>;

@Schema()
export class Provincia {
    @Prop({ required: true, unique: true, trim: true })
    codigo: string;

    @Prop({ required: true, trim: true, index: true })
    nombre: string;
}

export const ProvinciaSchema = SchemaFactory.createForClass(Provincia);
