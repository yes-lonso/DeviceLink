import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SedesController } from './sedes.controller';
import { SedesService } from './sedes.service';
import { Sede, SedeSchema } from './schemas/sede.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Sede.name, schema: SedeSchema }]),
    ],
    controllers: [SedesController],
    providers: [SedesService],
})
export class SedesModule { }
// Trigger rebuild
