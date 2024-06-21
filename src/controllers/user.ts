import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
        email: email
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

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT secret not found');

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

    res.status(201).json({ success: true, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating user' });
  }
};

export const logInUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      contrasena
    } = req.body;

    const user = await prisma.usuarios.findFirst({
      where: {
        email: email
      }
    });
    if (!user) throw new Error('User not found');

    const validPassword = await bcrypt.compare(contrasena, user.contrasena);
    if (!validPassword) throw new Error('User auth failed');
    
    // create JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT secret not found');

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    res.status(201).json({ success: true, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating user' });
  }
};