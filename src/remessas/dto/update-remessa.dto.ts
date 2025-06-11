import { PartialType } from '@nestjs/mapped-types';
import { CreateRemessaDto } from './create-remessa.dto';

export class UpdateRemessaDto extends PartialType(CreateRemessaDto) {}
