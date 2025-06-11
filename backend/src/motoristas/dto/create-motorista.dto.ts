import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Max, MaxLength, MinLength } from "class-validator";
import { StatusMotorista } from "../enum/statusMotorista.enum";

export class CreateMotoristaDto {
    @IsNotEmpty()
    @IsString()
    nome:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(11)
    cpf:string;

    @IsNotEmpty()
    @IsString()
    @MinLength(9)
    telefone:string

    @IsNotEmpty()
    @IsEmail()
    email:string

    @IsNotEmpty()
    @MinLength(11)
    cnh:string

    @IsOptional()
    @IsString()
    idCaminhao:string

    @IsEnum(StatusMotorista)
    @IsNotEmpty()
    statusMotorista:StatusMotorista
}
