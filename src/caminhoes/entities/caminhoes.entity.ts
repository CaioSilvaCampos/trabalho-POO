import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { statusCaminhao } from "../enum/statusCaminho.enum";
import { RemessaEntity } from "src/remessas/entities/remessa.entity";
import { RotaEntity } from "src/rotas/entities/rota.entity";
import { MotoristaEntity } from "src/motoristas/entities/motorista.entity";

@Entity('caminhoes')
export class CaminhaoEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({unique:true})
    placa:string

    @Column()
    capacidade:number

    @Column()
    marca:string

    @Column()
    modelo:string

    @Column()
    cor:string

    @Column({enum:statusCaminhao})
    status:statusCaminhao

    @OneToOne(()=> MotoristaEntity, (motorista)=> motorista.caminhao, {nullable:true})
    motorista: MotoristaEntity | null

    @OneToMany(()=> RemessaEntity, (remessa)=>remessa.caminhao, {eager:true})
    remessas: RemessaEntity[]

    @OneToMany(()=> RotaEntity, (rota) => rota.caminhao,)
    rotas: RotaEntity[]

    @Column('decimal', { precision: 10, scale: 2, nullable:true })
    capacidadeDisponivel:number
}
