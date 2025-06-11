import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { usuarioDTO } from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private readonly usuarioRepository: Repository<UsuarioEntity>
    ){}
    async login(usuarioDto: usuarioDTO){
        const user = await this.usuarioRepository.findOneBy({email: usuarioDto.email, password: usuarioDto.password})
        if(!user){
            throw new BadRequestException('Esse usuário não existe!')
        }
        else{
            return {sucesso: true, mensagem:"Login realizado com sucesso!"}
        }
    }

    async cadastro(usuarioDto: usuarioDTO){
        const usuario = new UsuarioEntity()
        usuario.email = usuarioDto.email
        usuario.password = usuarioDto.password

        const usuarioCriado = await this.usuarioRepository.save(usuario)
        return usuarioCriado
    }
}
