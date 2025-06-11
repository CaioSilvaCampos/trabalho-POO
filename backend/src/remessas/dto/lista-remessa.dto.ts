import { CaminhaoEntity } from "src/caminhoes/entities/caminhoes.entity";

export class RotaSimplesDto {
    origem: string;
    destino: string;
    duracao: string;
    caminhao?: CaminhaoEntity | null
}

export class RemessaRespostaDto {
    id: string;
    descricao: string;
    destinatario: string;
    status: string;
    prioridade: string;
    tipo:string;
    peso:number
    rota: RotaSimplesDto;
  }