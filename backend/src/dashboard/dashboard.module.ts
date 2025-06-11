import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaminhaoEntity } from 'src/caminhoes/entities/caminhoes.entity';
import { RotaEntity } from 'src/rotas/entities/rota.entity';
import { MotoristaEntity } from 'src/motoristas/entities/motorista.entity';
import { RemessaEntity } from 'src/remessas/entities/remessa.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CaminhaoEntity,RotaEntity,MotoristaEntity,RemessaEntity])],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule {}
