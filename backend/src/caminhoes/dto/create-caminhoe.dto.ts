import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";
import { statusCaminhao } from "../enum/statusCaminho.enum";

export class CreateCaminhoesDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(7)
    placa:string;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    capacidade:number

    @IsString()
    @IsNotEmpty()
    modelo:string

    @IsString()
    @IsNotEmpty()
    marca:string

    @IsEnum(statusCaminhao)
    @IsNotEmpty()
    status:statusCaminhao

    @IsString()
    @IsNotEmpty()
    cor:string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    idMotorista:string
}
