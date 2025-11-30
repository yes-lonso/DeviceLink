import { Module } from '@nestjs/common';
import { MunicipiosController } from './municipios.controller';
import { MunicipiosService } from './municipios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Provincia, ProvinciaSchema } from './schemas/provincia.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Provincia.name, schema: ProvinciaSchema }]),
    ],
    controllers: [MunicipiosController],
    providers: [MunicipiosService],
})
export class MunicipiosModule { }
