import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoordinatesService } from './coordinates.service';

@Module({
  imports: [ConfigModule],
  providers: [CoordinatesService],
  exports: [CoordinatesService], 
})
export class CoordinatesModule {}