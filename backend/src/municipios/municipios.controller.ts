import { Controller, Post, UploadedFile, UseInterceptors, Get, Param, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MunicipiosService } from './municipios.service';
import { BusquedaMunicipioDto } from './dto/busqueda-municipio.dto';
import { MunicipioRespuestaDto } from './dto/municipio-respuesta.dto';
import { ProvinciaRespuestaDto } from './dto/provincia-respuesta.dto';

@Controller('municipios')
export class MunicipiosController {
   constructor(private readonly municipiosService: MunicipiosService) {}

   @Get('buscar')
   async buscarMunicipios(
      @Query() busquedaDto: BusquedaMunicipioDto,
   ): Promise<MunicipioRespuestaDto[]> {
      return this.municipiosService.buscarMunicipios(busquedaDto);
   }

   @Post('subir')
   @UseInterceptors(FileInterceptor('file'))
   async subirMunicipios(@UploadedFile() file: Express.Multer.File) {
      return this.municipiosService.subirMunicipios(file);
   }

   @Get('provincias')
   async buscarProvincias(): Promise<ProvinciaRespuestaDto[]> {
      return this.municipiosService.buscarProvincias();
   }

   @Get(':id')
   async consultarMunicipios(@Param('id') id: string): Promise<MunicipioRespuestaDto[]> {
      return this.municipiosService.consultarMunicipios(id);
   }
}
