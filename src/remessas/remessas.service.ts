import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRemessaDto } from './dto/create-remessa.dto';
import { UpdateRemessaDto } from './dto/update-remessa.dto';
import { RemessaEntity } from './entities/remessa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RotasService } from 'src/rotas/rotas.service';
import { RemessaRespostaDto } from './dto/lista-remessa.dto';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';

@Injectable()
export class RemessasService {
  constructor(
    @InjectRepository(RemessaEntity)
        private readonly remessaRepository: Repository<RemessaEntity>,
    @InjectRepository(CaminhaoEntity)
        private readonly caminhaoRepository: Repository<CaminhaoEntity>,
        private readonly rotaService: RotasService,
        private readonly caminhaoService: CaminhoesService
  ){

  }
  async create(createRemessaDto: CreateRemessaDto) {
    const rota = await this.rotaService.findOne(createRemessaDto.idRota)
    const remessa = new RemessaEntity()
    remessa.descricao = createRemessaDto.descricao
    remessa.destinatario = createRemessaDto.destinatario
    remessa.status = createRemessaDto.status
    remessa.prioridade = createRemessaDto.prioridade
    remessa.rota = rota
    if(rota.caminhao?.id){
      const podeAtribuir = await this.rotaService.verificarCapacidadeCaminhao(rota.id, rota.caminhao.id, createRemessaDto.peso)
      if(!podeAtribuir){
        throw new BadRequestException('Essa carga excede a capacidade do caminhao!')
      }
      rota.caminhao.remessas = rota.remessas
      rota.caminhao.capacidadeDisponivel -= createRemessaDto.peso
      await this.caminhaoRepository.save(rota.caminhao)
    }
    remessa.peso = createRemessaDto.peso
    remessa.tipo = createRemessaDto.tipo
    const remessaSalva = await this.remessaRepository.save(remessa)
    if(remessaSalva.rota){
        const rota = await this.rotaService.findOne(remessaSalva.rota.id)
        for (const remessa of rota.remessas) {
        remessa.status = remessaSalva.status;
        await this.remessaRepository.save(remessa);
      } 
    }
    return {
      message: 'Remessa criada com sucesso',
      remessa
  } 
  }

  async findAll(): Promise<RemessaRespostaDto[]> {
    const remessas = await this.remessaRepository.find({relations:{
      rota:true
    },
  })

    if(remessas.length === 0){
      throw new NotFoundException('Não existem remessas cadastradas!')
    }

    else{
      return remessas.map((remessa) => ({
        id: remessa.id,
        descricao: remessa.descricao,
        destinatario: remessa.destinatario,
        status: remessa.status,
        prioridade: remessa.prioridade,
        tipo:remessa.tipo,
        peso:remessa.peso,
        rota: {
          origem: remessa.rota.origem,
          destino: remessa.rota.destino,
          duracao: remessa.rota.duracao
        },
      }));
    }
  }

    async remessaExists(id:string){
      const remessa = await this.remessaRepository.findOne({where:{
        id:id
      },
      relations:{
        rota:{
            caminhao:true
        }
      }
    })
      if(remessa == null){
        throw new NotFoundException('Essa remessa não esta cadastrada no nosso banco de dados!')
      }
      else{
        return remessa
      }
    }

  async findOne(id: string): Promise<RemessaRespostaDto> {
    const remessa = await this.remessaExists(id)
    return {
      id: remessa.id,
      descricao: remessa.descricao,
      destinatario: remessa.destinatario,
      status: remessa.status,
      prioridade: remessa.prioridade,
      peso:remessa.peso,
      tipo:remessa.tipo,
      rota: {
        origem: remessa.rota.origem,
        destino: remessa.rota.destino,
        duracao: remessa.rota.duracao,
        caminhao: remessa.rota.caminhao
      },
    };
  }

  async update(id: string, updateRemessaDto: UpdateRemessaDto) {
    const remessaEncontrada = await this.remessaExists(id)
    if(updateRemessaDto.idRota){
      const novaRota = await this.rotaService.findOne(updateRemessaDto.idRota)
      remessaEncontrada.rota = novaRota
    }
    if (updateRemessaDto.peso) {
      const idRota = updateRemessaDto.idRota ?? remessaEncontrada.rota.id;
      const rota = await this.rotaService.findOne(idRota);
      if (rota.caminhao) {
        const diferençaPeso = Number(updateRemessaDto.peso) - Number(remessaEncontrada.peso)
        const podeAtualizar = await this.caminhaoService.verificarCapacidadeAtualização(
          rota.caminhao.id,
          diferençaPeso 
        );
  
        if (!podeAtualizar) {
          throw new BadRequestException('Essa atualização excede a capacidade do caminhão!');
        }
        const pesoAntigo = Number(rota.caminhao.capacidadeDisponivel) + Number(remessaEncontrada.peso)
        rota.caminhao.capacidadeDisponivel = pesoAntigo
        await this.caminhaoRepository.save(rota.caminhao)

        const pesoNovo = pesoAntigo - Number(updateRemessaDto.peso)
        rota.caminhao.capacidadeDisponivel = pesoNovo
        await this.caminhaoRepository.save(rota.caminhao)
      }
    }
    Object.assign(remessaEncontrada, updateRemessaDto)
    const remessaAtualizada = await this.remessaRepository.save(remessaEncontrada)
      if(remessaAtualizada.rota){
        const rota = await this.rotaService.findOne(remessaAtualizada.rota.id)
        for (const remessa of rota.remessas) {
        remessa.status = remessaAtualizada.status;
        await this.remessaRepository.save(remessa);
      }   
      }
      
      return {
        message:'Remessa atualizada com sucesso',
        remessaAtualizada
      }
  }

  async remove(id: string) {
    const remessaEncontrada = await this.findOne(id)
    if (remessaEncontrada.rota?.caminhao) {
      await this.caminhaoService.aumentarCapacidadeDisponivel(remessaEncontrada.rota.caminhao.id, remessaEncontrada.id)
    }
    const result = await this.remessaRepository.delete(id);
    if (result.affected && result.affected > 0) {
        return {
          mensagem: 'Remessa excluída com sucesso',
          remessa:remessaEncontrada
        };
    }else {
      throw new NotFoundException('Não foi possivel excluir a rota.');
    }
  }
  }

