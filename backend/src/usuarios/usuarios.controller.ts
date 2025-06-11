import { Body, Controller, Post } from '@nestjs/common';
import { usuarioDTO } from './dto/usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuarioService: UsuariosService
    ){

    }
    @Post('/login')
    async login(@Body()usuarioDTO: usuarioDTO){
        return this.usuarioService.login(usuarioDTO)
    }

    @Post('/cadastro')

    async cadastro(@Body() usuarioDTO: usuarioDTO){
        return this.usuarioService.cadastro(usuarioDTO)
    }
}
