import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      email,
      apellido,
      contrasena,
      telefono
    } = req.body;

    const checkUser = await prisma.usuarios.findFirst({
      where: {
        email: req.body.email
      }
    });
    if (checkUser) throw new Error('User already exists');

    let userRole = await prisma.roles.findFirst({
      where: {
        nombre: 'user'
      }
    });
    if (!userRole) throw new Error('Role user not found');
    
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const user = await prisma.usuarios.create({ 
      data: {
        nombre,
        apellido,
        email,
        contrasena: hashedPassword,
        telefono,
        rolId: userRole.id
      }
    });
    res.status(201).json({ success: true, user });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating user' });
  }
};