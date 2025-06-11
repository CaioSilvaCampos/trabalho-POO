import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class usuarioDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNotEmpty()
    @IsString()
    password: string
}