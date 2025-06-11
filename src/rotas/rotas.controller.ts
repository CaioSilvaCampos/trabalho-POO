import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors } from '@nestjs/common';
import { RotasService } from './rotas.service';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('rotas')
//@UseInterceptors(CacheInterceptor)
export class RotasController {
  constructor(private readonly rotasService: RotasService) {}

  @Post()
  create(@Body() createRotaDto: CreateRotaDto) {
    return this.rotasService.create(createRotaDto);
  }

  @Get()
  async findAll() {
    return this.rotasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rotasService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRotaDto: UpdateRotaDto) {
    if (Object.keys(updateRotaDto).length === 0) {
      throw new BadRequestException('É necessário informar ao menos um campo para atualização.');
    }
    return this.rotasService.update(id, updateRotaDto); 
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.rotasService.remove(id);
  }
}
