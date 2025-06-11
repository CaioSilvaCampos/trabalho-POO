import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuario')
export class UsuarioEntity {
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:false})
    email: string

    @Column({nullable:false})
    password: string
}
