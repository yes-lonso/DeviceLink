import { Controller, Get, Query, Param, Post, Put, Body, Delete } from '@nestjs/common';
import { SedesService } from './sedes.service';
import { BusquedaSedeDto } from './dto/busqueda-sede.dto';
import { SedeRespuestaDto } from './dto/sede-respuesta.dto';
import { CreateSedeDto } from './dto/create-sede.dto';
import { UpdateSedeDto } from './dto/update-sede.dto';

@Controller('sedes')
export class SedesController {
    constructor(private readonly sedesService: SedesService) { }

    @Get()
    async consultarSedes(): Promise<SedeRespuestaDto[]> {
        return this.sedesService.consultarSedes();
    }

    @Post()
    async crearSede(@Body() createSedeDto: CreateSedeDto): Promise<SedeRespuestaDto> {
        return this.sedesService.crearSede(createSedeDto);
    }

    @Put(':id')
    async actualizarSede(@Param('id') id: string, @Body() updateSedeDto: UpdateSedeDto): Promise<SedeRespuestaDto> {
        return this.sedesService.actualizarSede(id, updateSedeDto);
    }

    @Delete(':id')
    async eliminarSede(@Param('id') id: string): Promise<void> {
        return this.sedesService.eliminarSede(id);
    }


}
