
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { statusCaminhao } from '../enum/statusCaminho.enum';

export class UpdateCaminhoeDto {
   @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsString()
  modelo?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsNumber()
  capacidade?: number;

  @IsOptional()
  @IsString()
  cor?: string;

  @IsOptional()
  @IsEnum(statusCaminhao)
  status?: statusCaminhao;

  @IsOptional()
  @IsString()
  idMotorista?: string;

  @IsOptional()
  @IsNumber()
  capacidadeDisponivel?: number;
}
