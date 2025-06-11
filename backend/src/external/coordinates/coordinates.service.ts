import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CoordinatesService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  async getCoordinates(cityName: string): Promise<{ lat: number; lng: number }> {
    const url = `${this.baseUrl}?format=json&q=${encodeURIComponent(cityName + ', Brasil')}`;

    const response = await axios.get(url, {
        timeout: 10000,
        headers: {
        'User-Agent': 'Logitrack/1.0 (caio.cramppos@gmail.com)', 
      },
    });

    const data = response.data;

    if (!data || data.length === 0) {
      throw new Error(`Coordenadas não encontradas para a cidade: ${cityName}`);
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
}