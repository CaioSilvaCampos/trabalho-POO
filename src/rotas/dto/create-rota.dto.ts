import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, Min, MinLength } from "class-validator";
import { StatusRota } from "../enum/statusRota.enum";

export class CreateRotaDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    origem:string

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    destino:string

    // @IsString()
    // @IsNotEmpty()
    // distanciaKm:string

    @IsEnum(StatusRota)
    @IsNotEmpty()
    status:StatusRota

    @IsString()
    @IsOptional()
    idCaminhao:string
}
