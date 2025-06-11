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

    @Column({ nullable: false, name: 'origem_latitude', type: 'decimal', precision: 10, scale: 6 })
    origem_lat: number;

    @Column({ nullable: false, name: 'origem_longitude', type: 'decimal', precision: 10, scale: 6 })
    origem_lng: number;

    @Column({nullable:false})
    destino: string;

    @Column({ nullable: false, name: 'destino_latitude', type: 'decimal', precision: 10, scale: 6 })
    destino_lat: number;

    @Column({ nullable: false, name: 'destino_longitude', type: 'decimal', precision: 10, scale: 6 })
    destino_lng: number;

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
