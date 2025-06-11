import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from 'config/postgres.config.service';
import { RotasModule } from './rotas/rotas.module';
import { RemessasModule } from './remessas/remessas.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CaminhoesModule } from './caminhoes/caminhoes.module';
import { MotoristasModule } from './motoristas/motoristas.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
 }),
 TypeOrmModule.forRootAsync({
  useClass: PostgresConfigService,
  inject: [PostgresConfigService]
 }),
 RotasModule,
 RemessasModule,
 CacheModule.register({isGlobal:true, ttl:10000}),
 CaminhoesModule,
 MotoristasModule,
 DashboardModule,
 UsuariosModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
