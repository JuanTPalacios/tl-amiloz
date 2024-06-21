import { z } from 'zod';

export const userCreationSchema = z.object({
  nombre: z.string(),
  apellido: z.string(),
  telefono: z.string(),
  email: z.string().email(),
  contrasena: z.string().min(8),
});