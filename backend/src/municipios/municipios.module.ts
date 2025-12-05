import { Module } from '@nestjs/common';
import { MunicipiosController } from './municipios.controller';
import { MunicipiosService } from './municipios.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Provincia, ProvinciaSchema } from './schemas/provincia.schema';
import { Municipio, MunicipioSchema } from './schemas/municipio.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Provincia.name, schema: ProvinciaSchema },
            { name: Municipio.name, schema: MunicipioSchema },
        ]),
    ],
    controllers: [MunicipiosController],
    providers: [MunicipiosService],
})
export class MunicipiosModule { }
