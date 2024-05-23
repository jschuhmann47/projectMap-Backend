import { Document } from 'mongoose';
import { Area } from './enums';

export interface PestelPreSeed extends Document {
  area: Area;
  descripcion: string;
  consejoPositivo: string;
  consejoNegativo: string;
  puntaje: number;
}
