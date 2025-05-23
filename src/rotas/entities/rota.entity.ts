import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusRota } from "../enum/statusRota.enum";
import { RemessaEntity } from "src/remessas/entities/remessa.entity";
import { CaminhaoEntity } from "src/caminhoes/entities/caminhoes.entity";

@Entity('rotas')
export class RotaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable:false})
    origem: string;

    @Column({nullable:false})
    destino: string;

    @Column({nullable:false})
    distanciaKm: string;

    @Column({enum:StatusRota, nullable:false})
    status: StatusRota

    @Column({nullable:true})
    duracao:string;

    @ManyToOne(()=> CaminhaoEntity, caminhao=> caminhao.rotas, {nullable:true})
    caminhao: CaminhaoEntity | null

    @OneToMany(()=> RemessaEntity, remessa=> remessa.rota, {eager:true})
    remessas: RemessaEntity[]
}
