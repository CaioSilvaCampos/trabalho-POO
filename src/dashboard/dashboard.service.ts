import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';
import { MotoristaEntity } from 'src/motoristas/entities/motorista.entity';
import { StatusMotorista } from 'src/motoristas/enum/statusMotorista.enum';
import { RemessaEntity } from 'src/remessas/entities/remessa.entity';
import { RotaEntity } from 'src/rotas/entities/rota.entity';
import { StatusRota } from 'src/rotas/enum/statusRota.enum';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(RemessaEntity)
        private readonly remessaRepository: Repository<RemessaEntity>,

        @InjectRepository(CaminhaoEntity)
        private readonly caminhaoRepository: Repository<CaminhaoEntity>,

        @InjectRepository(MotoristaEntity)
        private readonly motoristaRepository: Repository<MotoristaEntity>,

        @InjectRepository(RotaEntity)
        private readonly rotaRepository: Repository<RotaEntity>, 
    ){}
     
    
    destinoMaisFrequente(rotas: RotaEntity[]){
        const contagemDestinos = {}
        rotas.forEach((rota)=>{
            const destino = rota.destino
            contagemDestinos[destino] = (contagemDestinos[destino] || 0) + 1
           // console.log(contagemDestinos[destino])
        })

        let maiorContagem = 0
        let destinosMaisFrequentes: string[] = [];

        for (const destino in contagemDestinos) {
            if (contagemDestinos[destino] > maiorContagem) {
            maiorContagem = contagemDestinos[destino];
            destinosMaisFrequentes.push(destino)
            } 
            else if (contagemDestinos[destino] === maiorContagem) {
            destinosMaisFrequentes.push(destino);
            }
        }
        console.log(destinosMaisFrequentes)
        return destinosMaisFrequentes
    }
    
    

    async indicadores(){
        const rotas = await this.rotaRepository.find()
        const totalRotasAtivas = await this.rotaRepository.findAndCount({
            where:{status: StatusRota.ATIVA} 
        })
        const totalRotasInativas = await this.rotaRepository.findAndCount({
            where:{status:StatusRota.INATIVA}
        })
        const totalKm = totalRotasAtivas[0].reduce((soma, rota) => {
            let km = parseFloat(rota.distanciaKm.split(' ')[0]) 
            return soma + (isNaN(km) ? 0 : km)
        }, 0)
        const totalRemessas = await this.remessaRepository.findAndCount({})
        const kmMedio = totalKm / totalRotasAtivas[1]
        const destinoMaisFrequente = this.destinoMaisFrequente(rotas)
        const totalPeso = totalRemessas[0].reduce((soma, remessa)=> {
            const kg = parseFloat(remessa.peso.toString());
            return soma + (isNaN(kg) ? 0 : kg);
        }, 0)
        const totalMotoristasAtivos = await this.motoristaRepository.findAndCount({
            where:{statusMotorista: StatusMotorista.DISPONIVEL}
        })
        const totalMotoristasInativos = await this.motoristaRepository.findAndCount({
            where:{statusMotorista: StatusMotorista.INDISPONIVEL}
        })
        return {
            totalRotasAtivas: totalRotasAtivas[1],
            totalRotasInativas: totalRotasInativas[1],
            totalRemessas: totalRemessas[1],
            totalMotoristasAtivos: totalMotoristasAtivos[1],
            totalMotoristasInativos: totalMotoristasInativos[1],
            totalKm,
            kmMedio,
            destinoMaisFrequente,
            totalPeso
        }
    }

    
}
