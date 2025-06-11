import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { prioridadeRemessas } from "../enum/prioridadeRemessa.enum";
import { StatusRemessa } from "../enum/statusRemessa.enum";


export class CreateRemessaDto {
    @IsString()
    @IsNotEmpty()
    descricao: string;
    @IsString()
    @IsNotEmpty()
    destinatario: string;

    @IsEnum(prioridadeRemessas)
    @IsNotEmpty()
    prioridade:prioridadeRemessas

    @IsEnum(StatusRemessa)
    @IsNotEmpty()
    status:StatusRemessa

    @IsNotEmpty()
    @IsString()
    tipo:string

    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    peso:number

    @IsString()
    @IsNotEmpty()
    idRota: string
}
