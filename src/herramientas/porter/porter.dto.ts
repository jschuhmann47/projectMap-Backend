import { ApiProperty } from '@nestjs/swagger';
import { Fuerza } from './fuerza';
import { NivelDeConcordancia } from './nivelDeConcordancia';
import { Pregunta } from './porter.schema';
import { Valoracion } from './valoracion';

export class PorterDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  projectId: string;

  @ApiProperty()
  titulo: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  preguntas: Pregunta[];
}

export class PreguntaDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  preguntaId: number;

  @ApiProperty()
  fuerza: Fuerza;

  @ApiProperty()
  nivelDeConcordancia: NivelDeConcordancia;

  @ApiProperty()
  valoracion: Valoracion;
}

export class BulkEditQuestions {
  preguntas: Map<Fuerza, Map<number, BulkQuestionItem>>;
}

export class BulkQuestionItem {
  @ApiProperty()
  nivelDeConcordancia: NivelDeConcordancia;

  @ApiProperty()
  valoracion: Valoracion;
}
