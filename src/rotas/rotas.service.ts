import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRotaDto } from './dto/create-rota.dto';
import { UpdateRotaDto } from './dto/update-rota.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RotaEntity } from './entities/rota.entity';
import { Repository } from 'typeorm';
import { DistanceService } from 'src/external/distance/distance.service';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';
import { statusCaminhao } from 'src/caminhoes/enum/statusCaminho.enum';
import { CoordinatesService } from 'src/external/coordinates/coordinates.service';

@Injectable()
export class RotasService {
  constructor(
    @InjectRepository(RotaEntity)
    private readonly rotaRepository: Repository<RotaEntity>,
    @InjectRepository(CaminhaoEntity)
    private readonly caminhaoRepository: Repository<CaminhaoEntity>,
    private readonly distanceService: DistanceService,
    private readonly caminhaoService: CaminhoesService,
    private readonly coordinatesService: CoordinatesService
  ){

  }
  async create(createRotaDto: CreateRotaDto) {
    const rota = new RotaEntity()
    if(createRotaDto.idCaminhao){
      const caminhao = await this.caminhaoService.caminhaoExists(createRotaDto.idCaminhao)
      rota.caminhao = caminhao
      caminhao.status = statusCaminhao.INDISPONIVEL
      await this.caminhaoRepository.save(caminhao)
    }
    else{
      rota.caminhao = null
    }
  
    const coordenadasOrigem = await this.coordinatesService.getCoordinates(createRotaDto.origem)
    const coordenadasDestino = await this.coordinatesService.getCoordinates(createRotaDto.destino)
    const distanciaInfo = await this.distanceService.calcularDistancia(createRotaDto.origem, createRotaDto.destino);  

    rota.destino = createRotaDto.destino
    rota.origem = createRotaDto.origem
    rota.status = createRotaDto.status
    rota.distanciaKm = distanciaInfo.distancia_km
    rota.duracao = distanciaInfo.duracao
    rota.origem_lat = coordenadasOrigem.lat
    rota.origem_lng = coordenadasOrigem.lng
    rota.destino_lat = coordenadasDestino.lat
    rota.destino_lng = coordenadasDestino.lng
    
    
    

    const rotaSalva = await this.rotaRepository.save(rota)

    return {
      message:'Rota salva com sucesso',
      rotaSalva
    }
  }

 async findAll() {
    const rotas = await this.rotaRepository.find({relations:{
      caminhao:true
    }})
    if(rotas.length == 0){
      return 'Não existem rotas cadastradas.'
    }
    else{
      return rotas
    } 
  }

  async findOne(id: string) {
    const rotaEncontrada = await this.rotaRepository.findOne({where:{
      id:id
    },
    relations:{
      caminhao:true,
      remessas:true
    }
  })
    if(rotaEncontrada == null){
      throw new NotFoundException('Não existe nenhuma rota cadastrada com o id informado!')
    }
    else{
      return rotaEncontrada
    }
  }

  async update(id: string, updateRotaDto: UpdateRotaDto) {
    console.log(updateRotaDto)
    const rotaEncontrada = await this.findOne(id)
    let origem = updateRotaDto.origem ?? rotaEncontrada.origem;
    let destino = updateRotaDto.destino ?? rotaEncontrada.destino;
  
    if (updateRotaDto.origem != rotaEncontrada.origem || updateRotaDto.destino != rotaEncontrada.destino) {
      const origemCoordenadas = await this.coordinatesService.getCoordinates(origem)
      const destinoCoordenadas = await this.coordinatesService.getCoordinates(destino)
      const distanciaInfo = await this.distanceService.calcularDistancia(origem, destino);
      rotaEncontrada.distanciaKm = distanciaInfo.distancia_km;
      rotaEncontrada.duracao = distanciaInfo.duracao
      rotaEncontrada.origem_lat = origemCoordenadas.lat
      rotaEncontrada.origem_lng = origemCoordenadas.lng
      rotaEncontrada.destino_lat = destinoCoordenadas.lat
      rotaEncontrada.destino_lng = destinoCoordenadas.lng
    }
    if(updateRotaDto.idCaminhao == null || updateRotaDto.idCaminhao == 'nao_atribuido'){
        if(rotaEncontrada.caminhao){
          rotaEncontrada.caminhao.status = statusCaminhao.DISPONIVEL
          await this.caminhaoRepository.save(rotaEncontrada.caminhao)
        }
        rotaEncontrada.caminhao = null
      }
    else if(updateRotaDto.idCaminhao !== rotaEncontrada.caminhao?.id && updateRotaDto.idCaminhao){
      if(rotaEncontrada.caminhao){
          rotaEncontrada.caminhao.status = statusCaminhao.DISPONIVEL
          await this.caminhaoRepository.save(rotaEncontrada.caminhao)
        }
      const caminhao = await this.caminhaoService.caminhaoExists(updateRotaDto.idCaminhao)
      await this.caminhaoService.verificarDisponibilidadeCaminhao(caminhao.id)
      const podeAtribuir = await this.verificarCapacidadeCaminhao(id, updateRotaDto.idCaminhao)
      if(!podeAtribuir){
        throw new BadRequestException('Esse caminhão não suporta a carga que está atribuida a essa rota!')
      }
      await this.caminhaoService.verificarDisponibilidadeCaminhao(caminhao.id)
      rotaEncontrada.caminhao = caminhao
      caminhao.remessas = rotaEncontrada.remessas
      caminhao.capacidadeDisponivel = caminhao.capacidade - rotaEncontrada.remessas.reduce((soma, remessa) => soma + Number(remessa.peso), 0)
      caminhao.status = statusCaminhao.INDISPONIVEL
      await this.caminhaoRepository.save(caminhao)
      }
    else if(updateRotaDto.idCaminhao == null || updateRotaDto.idCaminhao == 'nao_atribuido'){
        if(rotaEncontrada.caminhao){
          rotaEncontrada.caminhao.status = statusCaminhao.DISPONIVEL
          await this.caminhaoRepository.save(rotaEncontrada.caminhao)
        }
        rotaEncontrada.caminhao = null
      }
    else if(updateRotaDto.idCaminhao && rotaEncontrada.caminhao == null){
      const caminhao = await this.caminhaoService.caminhaoExists(updateRotaDto.idCaminhao)
      const podeAtribuir = await this.verificarCapacidadeCaminhao(id, updateRotaDto.idCaminhao)
      if(!podeAtribuir){
        throw new BadRequestException('Esse caminhão não suporta a carga que está atribuida a essa rota!')
      }
      rotaEncontrada.caminhao = caminhao
      caminhao.remessas = rotaEncontrada.remessas
      caminhao.capacidadeDisponivel = caminhao.capacidade - rotaEncontrada.remessas.reduce((soma, remessa) => soma + Number(remessa.peso), 0)
      caminhao.status = statusCaminhao.INDISPONIVEL
      await this.caminhaoRepository.save(caminhao)
    }
    Object.assign(rotaEncontrada, updateRotaDto)
    const rotaAtualizada = await this.rotaRepository.save(rotaEncontrada)
    return {
      message:"Rota atualizada com sucesso!",
      rotaAtualizada
    }
  }

  async remove(id: string) {
    const rota = await this.findOne(id); 
  
    const result = await this.rotaRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Rota excluída com sucesso',
        rota: rota,
      };
    } else {
      throw new NotFoundException('Rota não encontrada ou já foi excluída.');
    }
  }

  async listarRemessasDaRota(idRota: string){
    const rota = await this.rotaRepository.findOne({
      where: { id: idRota },
      relations: { remessas: true },
    });
  
    if (!rota) {
      throw new NotFoundException('Rota não encontrada.');
    }
  
    return rota.remessas;
  }

  async verificarCapacidadeCaminhao(
    idRota: string,
    idCaminhao: string,
    pesoNovaRemessa: number = 0 
  ): Promise<boolean> {
    const caminhao = await this.caminhaoService.findOne(idCaminhao);
    const remessas = await this.listarRemessasDaRota(idRota);
    const pesoTotal = remessas.reduce((soma, remessa) => soma + Number(remessa.peso), 0) + Number(pesoNovaRemessa);
  
    return pesoTotal <= caminhao.capacidade;
  }

  
}
