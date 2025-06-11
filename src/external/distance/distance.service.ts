import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

@Injectable()
export class DistanceService {
   private readonly apiKey: string;
  constructor(private configService: ConfigService){
    const key = this.configService.get<string>('API_KEY');
    if (!key) {
    throw new Error('API_KEY não configurada no .env');
   }
    this.apiKey = key;
  }
  async calcularDistancia(origem: string, destino: string) {
    
    const url = `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${encodeURIComponent(origem)}&destinations=${encodeURIComponent(destino)}&key=${this.apiKey}`;

    const { data } = await axios.get(url);
    

    if (data.status !== 'OK' || data.rows[0].elements[0].status !== 'OK') {
      throw new Error('Não foi possível calcular a distância');
    }

    return {
      distancia_km: data.rows[0].elements[0].distance.text,
      duracao: data.rows[0].elements[0].duration.text,
    };

  }
}
