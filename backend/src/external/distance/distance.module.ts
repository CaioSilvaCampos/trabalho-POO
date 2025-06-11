import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DistanceService } from './distance.service';

@Module({
  imports: [ConfigModule],
  providers: [DistanceService],
  exports: [DistanceService], // permite usar em outros módulos
})
export class DistanceModule {}