import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCaminhoesDto } from './dto/create-caminhoe.dto';
import { UpdateCaminhoeDto } from './dto/update-caminhoe.dto';
import { CaminhaoEntity } from './entities/caminhoes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { listaCaminhaoDTO } from './dto/lista-caminhao.dto';
import { MotoristasService } from 'src/motoristas/motoristas.service';
import { StatusMotorista } from 'src/motoristas/enum/statusMotorista.enum';
import { MotoristaEntity } from 'src/motoristas/entities/motorista.entity';
import { statusCaminhao } from './enum/statusCaminho.enum';
import { RemessaEntity } from 'src/remessas/entities/remessa.entity';

@Injectable()
export class CaminhoesService {
  constructor(
    @InjectRepository(CaminhaoEntity)
    private readonly caminhaoRepository: Repository<CaminhaoEntity>,
    @Inject(forwardRef(()=>MotoristasService))
    private readonly motoristaService:MotoristasService,
    @InjectRepository(MotoristaEntity)
    private readonly motoristaRepository: Repository<MotoristaEntity>,
    @InjectRepository(RemessaEntity)
    private readonly remessaRepository: Repository<RemessaEntity>,
  ){}
  
    async caminhaoExists(id:string){
      const caminhao = await this.caminhaoRepository.findOneBy({id})
      if(!caminhao){
        throw new NotFoundException('Esse caminhao nao existe')
      }
      else{
        return caminhao
      }
    }

    async caminhaoExistsByPlaca(placa:string){
      const caminhao = await this.caminhaoRepository.findOneBy({placa})
      if(caminhao){
        throw new BadRequestException("Já existe um caminhão cadastrado com essa placa!")
      }
    }

    async create(createCaminhoesDto: CreateCaminhoesDto) { 
    const caminhao = new CaminhaoEntity()
    if(createCaminhoesDto.idMotorista){
      const motorista = await this.motoristaService.findOne(createCaminhoesDto.idMotorista)
      await this.motoristaService.motoristaDisponivel(motorista.id)
      caminhao.motorista = motorista
      motorista.statusMotorista = StatusMotorista.INDISPONIVEL
      await this.motoristaRepository.save(motorista)
    }
    else{
      caminhao.motorista = null
    }
    await this.caminhaoExistsByPlaca(createCaminhoesDto.placa)
    caminhao.capacidade = createCaminhoesDto.capacidade
    caminhao.placa = createCaminhoesDto.placa
    caminhao.status = createCaminhoesDto.status
    caminhao.cor = createCaminhoesDto.cor
    caminhao.marca = createCaminhoesDto.marca
    caminhao.modelo = createCaminhoesDto.modelo
    caminhao.capacidadeDisponivel = caminhao.capacidade

    const caminhaoCriado = await this.caminhaoRepository.save(caminhao)
    return caminhaoCriado
  }

  async findAll() {
    const caminhoes = await this.caminhaoRepository.find({
      relations: {
        remessas: true,
        motorista:true
      },
    });
  
    if (caminhoes.length === 0) {
      throw new NotFoundException('Não existem caminhões cadastrados!');
    }
  
    return caminhoes
  }

  async findOne(id: string): Promise<listaCaminhaoDTO> {
    const caminhao = await this.caminhaoRepository.findOne({
      where: { id },
      relations: { remessas: true, motorista:true },
    });
  
    if (!caminhao) {
      throw new NotFoundException('Esse caminhão não existe no nosso banco de dados!');
    }


  
    return {
      id: caminhao.id,
      placa: caminhao.placa,
      capacidade: caminhao.capacidade,
      modelo: caminhao.modelo,
      marca: caminhao.marca,
      status: caminhao.status,
      cor: caminhao.cor,
      capacidadeDisponivel: caminhao.capacidadeDisponivel,
      motorista: caminhao.motorista || null,
      remessa: caminhao.remessas.map((remessa) => ({
        id: remessa.id,
        descricao: remessa.descricao,
        peso: remessa.peso,
      })),
    };
  }

  async update(id: string, updateCaminhoeDto: UpdateCaminhoeDto) {
    const caminhaoEncontrado = await this.caminhaoExists(id)
    if(updateCaminhoeDto.idMotorista){
      const motorista = await this.motoristaService.findOne(updateCaminhoeDto.idMotorista)
      await this.motoristaService.motoristaDisponivel(motorista.id)
      motorista.statusMotorista = StatusMotorista.INDISPONIVEL
      await this.motoristaRepository.save(motorista)
      caminhaoEncontrado.motorista = motorista
    }
    for (const [key, value] of Object.entries(updateCaminhoeDto)) {
    if (value !== undefined) {
      caminhaoEncontrado[key] = value;
    }
  }
  const caminhaoAtualizado = await this.caminhaoRepository.save(caminhaoEncontrado);
  console.log(caminhaoAtualizado.motorista)
  return caminhaoAtualizado;
}

  async remove(id: string) {
    const caminhao = await this.findOne(id); 
  
    const result = await this.caminhaoRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Caminhao excluído com sucesso',
        caminhao: caminhao,
      };
    } else {
      throw new NotFoundException('Caminhao não encontrado ou já foi excluído.');
    }
  }

  async atualizarCapacidadeDisponivel(caminhaoId: string) {
    const caminhao = await this.caminhaoRepository.findOne({
      where: { id: caminhaoId },
      relations: { remessas: true },
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrado.');
    }

    const pesoOcupado = caminhao.remessas.reduce((total, remessa) => total + remessa.peso, 0);
    caminhao.capacidadeDisponivel = caminhao.capacidade - pesoOcupado;

    return this.caminhaoRepository.save(caminhao);
  }

  async aumentarCapacidadeDisponivel(caminhaoId: string, remessaId: string) {
    const remessa = await this.remessaRepository.findOneBy({id:remessaId})
    if(!remessa){
      throw new NotFoundException("Essa remessa não existe")
    }
    const caminhao = await this.caminhaoRepository.findOne({
      where: { id: caminhaoId },
      relations: { remessas: true },
    });

    if (!caminhao) {
      throw new NotFoundException('Caminhão não encontrado.');
    }
    const novaCapacidade = Number(caminhao.capacidadeDisponivel) + Number(remessa.peso);
    caminhao.capacidadeDisponivel = novaCapacidade

    return this.caminhaoRepository.save(caminhao);
  }

  async verificarDisponibilidadeCaminhao(id:string): Promise<boolean>{
    const caminhao = await this.caminhaoRepository.findOneBy({id:id})
    if(caminhao?.status == statusCaminhao.DISPONIVEL){
      return true
    }
    else{
      throw new BadRequestException('Esse caminhão está indisponivel!')
    }
  }

  async verificarCapacidadeAtualização(id:string, deltaPeso: number){
    const caminhao = await this.caminhaoExists(id);

      if (deltaPeso <= 0) return true;

    return caminhao.capacidadeDisponivel >= deltaPeso;
  }
  
  }

