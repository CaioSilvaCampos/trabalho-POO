import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseInterceptors } from '@nestjs/common';
import { RemessasService } from './remessas.service';
import { CreateRemessaDto } from './dto/create-remessa.dto';
import { UpdateRemessaDto } from './dto/update-remessa.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('remessas')
//@UseInterceptors(CacheInterceptor)
export class RemessasController {
  constructor(private readonly remessasService: RemessasService) {}

  @Post()
  create(@Body() createRemessaDto: CreateRemessaDto) {
    return this.remessasService.create(createRemessaDto);
  }

  @Get()
  findAll() {
    return this.remessasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.remessasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRemessaDto: UpdateRemessaDto) {
    if (Object.keys(updateRemessaDto).length === 0) {
      throw new BadRequestException('É necessário informar ao menos um campo para atualização.');
    }
    return this.remessasService.update(id, updateRemessaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.remessasService.remove(id);
  }
}
