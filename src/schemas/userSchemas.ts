import { z } from 'zod';
import { Periodos } from '../utils/types';

export const userCreationSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  telefono: z.string(),
  email: z.string().email(),
  contrasena: z.string().min(8),
});

export const userLogInSchema = z.object({
  email: z.string().email(),
  contrasena: z.string().min(8),
});

export const offerCreationSchema = z.object({
  titulo: z.string(),
  monto: z.number(),
  plazo: z.nativeEnum(Periodos),
  quotas: z.number(),
  interes: z.number(),
});