import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { CaminhaoEntity } from "src/caminhoes/entities/caminhoes.entity";
import { MotoristaEntity } from "src/motoristas/entities/motorista.entity";
import { RemessaEntity } from "src/remessas/entities/remessa.entity";
import { RotaEntity } from "src/rotas/entities/rota.entity";
import { UsuarioEntity } from "src/usuarios/entities/usuario.entity";


@Injectable()
export class PostgresConfigService implements TypeOrmOptionsFactory{
    constructor(private configService: ConfigService){}

    createTypeOrmOptions(): TypeOrmModuleOptions{
        return{
            type: 'postgres',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            entities:[CaminhaoEntity, RemessaEntity, RotaEntity, MotoristaEntity, UsuarioEntity],
            synchronize: true
        }
    }
}