import { CaminhaoEntity } from "src/caminhoes/entities/caminhoes.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StatusMotorista } from "../enum/statusMotorista.enum";

@Entity('motoristas')
export class MotoristaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({nullable:false})
    nome: string

    @Column({nullable: false, length:11})
    cpf: string

    @Column({nullable:false})
    telefone: string

    @Column({nullable: false})
    email: string

    @Column({nullable:false, length:11})
    cnh: string

    @OneToOne(()=> CaminhaoEntity, (caminhao)=> caminhao.motorista, {nullable:true})
    @JoinColumn()
    caminhao: CaminhaoEntity | null

    @Column({nullable:false, enum:StatusMotorista})
    statusMotorista: StatusMotorista
}
