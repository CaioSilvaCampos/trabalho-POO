import { forwardRef, Module } from '@nestjs/common';
import { CaminhoesService } from './caminhoes.service';
import { CaminhoesController } from './caminhoes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaminhaoEntity } from './entities/caminhoes.entity';
import { MotoristasService } from 'src/motoristas/motoristas.service';
import { MotoristasModule } from 'src/motoristas/motoristas.module';
import { MotoristaEntity } from 'src/motoristas/entities/motorista.entity';
import { RemessaEntity } from 'src/remessas/entities/remessa.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CaminhaoEntity,MotoristaEntity, RemessaEntity]), forwardRef(()=> MotoristasModule)],
  controllers: [CaminhoesController],
  providers: [CaminhoesService],
  exports:[CaminhoesService]
})
export class CaminhoesModule {}
