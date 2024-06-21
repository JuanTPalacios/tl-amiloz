import { z } from 'zod';
import { Periodos } from '../utils/types';

export const offerCreationSchema = z.object({
  titulo: z.string(),
  monto: z.number(),
  plazo: z.nativeEnum(Periodos),
  quotas: z.number()
});

export const prestamoCreationSchema = z.object({
  ofertaId: z.number(),
});

export const pagoSchema = z.object({
  monto: z.number(),
});

