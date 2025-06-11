import { forwardRef, Module } from '@nestjs/common';
import { MotoristasService } from './motoristas.service';
import { MotoristasController } from './motoristas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotoristaEntity } from './entities/motorista.entity';
import { CaminhoesModule } from 'src/caminhoes/caminhoes.module';

@Module({
  imports:[TypeOrmModule.forFeature([MotoristaEntity]), forwardRef(()=>CaminhoesModule)],
  controllers: [MotoristasController],
  providers: [ MotoristasService],
  exports:[MotoristasService]
})
export class MotoristasModule {}
