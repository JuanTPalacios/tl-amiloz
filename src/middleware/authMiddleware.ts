import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient, Roles } from '@prisma/client';
import { AuthRequest } from '../utils/types';

const prisma = new PrismaClient();

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeaders = req.headers['authorization'];
  if (!authHeaders) return res.status(403).json({ success: false, error: 'No token provided' });
  const token = authHeaders.split(' ')[1];

  const SECRET_KEY = process.env.JWT_SECRET;
  if (!SECRET_KEY) return res.status(500).json({ success: false, error: 'Internal Server Error' });

  try {
    const { id } = jwt.verify(token, SECRET_KEY) as { id: number };
    const user = await prisma.usuarios.findUnique({
      where: {
        id: id
      },
      include: {
        Roles: true
      }
    });
    if (!user) return res.sendStatus(401);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: 'Forbidden' });
  }
};