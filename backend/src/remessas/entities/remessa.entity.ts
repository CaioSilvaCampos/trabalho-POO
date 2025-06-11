import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { StatusRemessa } from "../enum/statusRemessa.enum";
import { prioridadeRemessas } from "../enum/prioridadeRemessa.enum";
import { RotaEntity } from "src/rotas/entities/rota.entity";
import { CaminhaoEntity } from "src/caminhoes/entities/caminhoes.entity";

@Entity('remessas')
export class RemessaEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    descricao:string;

    @Column({nullable:false})
    destinatario:string;

    @Column({enum:StatusRemessa, nullable:false})
    status:StatusRemessa

    @Column({enum:prioridadeRemessas, nullable:false})
    prioridade:prioridadeRemessas

    @Column({nullable:false})
    tipo:string

    @Column('decimal', { precision: 10, scale: 2, nullable:false })
    peso:number

   @ManyToOne(()=> RotaEntity, rota=> rota.remessas, {cascade:true, onDelete:'CASCADE'})
    rota:RotaEntity

    @ManyToOne(()=> CaminhaoEntity, caminhao=> caminhao.remessas)
    caminhao:CaminhaoEntity
}
