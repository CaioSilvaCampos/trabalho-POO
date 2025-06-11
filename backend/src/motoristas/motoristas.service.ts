import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMotoristaDto } from './dto/create-motorista.dto';
import { UpdateMotoristaDto } from './dto/update-motorista.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MotoristaEntity } from './entities/motorista.entity';
import { Repository } from 'typeorm';
import { CaminhoesService } from 'src/caminhoes/caminhoes.service';

@Injectable()
export class MotoristasService {
  constructor(
    @InjectRepository(MotoristaEntity)
    private readonly motoristaRepository: Repository<MotoristaEntity>,
    @Inject(forwardRef(()=>CaminhoesService))
    private readonly caminhaoService:CaminhoesService,
  ){}

  async checkIfCPFExists(cpf:string){
    const motorista = await this.motoristaRepository.findOneBy({cpf})
    if(motorista){
      throw new BadRequestException('Já existe um motorista com esse CPF cadastrado!')
    }
  }

  async create(createMotoristaDto: CreateMotoristaDto) {
    const motorista = new MotoristaEntity()
    await this.checkIfCPFExists(createMotoristaDto.cpf)
    if(createMotoristaDto.idCaminhao){
      const caminhao = await this.caminhaoService.caminhaoExists(createMotoristaDto.idCaminhao)
      motorista.caminhao = caminhao 
    }
    else{
      motorista.caminhao = null
    }
    motorista.cpf = createMotoristaDto.cpf
    motorista.nome = createMotoristaDto.nome
    motorista.telefone = createMotoristaDto.telefone
    motorista.email = createMotoristaDto.email
    motorista.cnh = createMotoristaDto.cnh
    motorista.statusMotorista = createMotoristaDto.statusMotorista

    const motoristaSalvo = await this.motoristaRepository.save(motorista)
    return motoristaSalvo
  }

  async findAll() {
    const motoristas = await this.motoristaRepository.find({
      relations:{caminhao: true}
    })
    if(motoristas.length === 0) {
      return 'Não existem motoristas cadastrados!'
    }
    else{
      return motoristas
    }
  }

  async findOne(id: string) {
    const motorista = await this.motoristaRepository.findOne({
      where:{id: id},
      relations:{caminhao: true}
    })
    if(!motorista){
      throw new NotFoundException('Esse motorista não existe!')
    }
    else{
      return motorista
    }
  }

  async update(id: string, updateMotoristaDto: UpdateMotoristaDto) {
    const motorista = await this.findOne(id)
    if(updateMotoristaDto.idCaminhao){
      const caminhao = await this.caminhaoService.caminhaoExists(updateMotoristaDto.idCaminhao)
      motorista.caminhao = caminhao
    }
    Object.assign(motorista, updateMotoristaDto);
    const motoristaAtualizado = await this.motoristaRepository.save(motorista)
    return motoristaAtualizado
  }

  async remove(id: string) {
    const motorista = await this.findOne(id); 
  
    const result = await this.motoristaRepository.delete(id);
  
    if (result.affected && result.affected > 0) {
      return {
        mensagem: 'Motorista excluído com sucesso',
        motorista: motorista,
      };
    } else {
      throw new NotFoundException('Motorista não encontrado ou já foi excluído.');
    }
  }

  async motoristaDisponivel(id: string): Promise<boolean>{
    const motorista = await this.findOne(id)
    if(motorista.statusMotorista == 'disponivel'){
      return true
    }
    else{
      throw new BadRequestException('Esse motorista está indisponível')
    }
  }
}
