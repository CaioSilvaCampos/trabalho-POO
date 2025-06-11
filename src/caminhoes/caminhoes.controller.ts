import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CaminhoesService } from './caminhoes.service';
import { CreateCaminhoesDto } from './dto/create-caminhoe.dto';
import { UpdateCaminhoeDto } from './dto/update-caminhoe.dto';

@Controller('caminhoes')
export class CaminhoesController {
  constructor(private readonly caminhoesService: CaminhoesService ) {}

  @Post()
  create(@Body() createCaminhoesDto: CreateCaminhoesDto) {
    return this.caminhoesService.create(createCaminhoesDto);
  }

  @Get()
  findAll() {
    return this.caminhoesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caminhoesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaminhoeDto: UpdateCaminhoeDto) {
    if (Object.keys(updateCaminhoeDto).length === 0) {
      throw new BadRequestException('É necessário informar ao menos um campo para atualização.');
    }
    return this.caminhoesService.update(id, updateCaminhoeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caminhoesService.remove(id);
  }
}
