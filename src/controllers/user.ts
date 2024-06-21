import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../utils/types';

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
    
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT secret not found');

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });
    res.status(201).json({ success: true, token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating user' });
  }
};

export const addOffer = async (req: AuthRequest, res: Response) => {
  try {
    const {
      titulo,
      monto,
      plazo,
      quotas
    } = req.body;

    const userParam = req.params.userId;
    const user = await prisma.usuarios.findUnique({
      where: {
        id: parseInt(userParam)
      }
    });
    if (!user) throw new Error('User not found');

    const offer = await prisma.ofertas.create({
      data: {
        titulo,
        monto,
        plazo,
        quotas,
        userId: user.id
      }
    });

    res.status(201).json({ success: true, offer });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating offer' });
  }
}

export const addPrestamo = async (req: AuthRequest, res: Response) => {
  try {
    const {
      ofertaId
    } = req.body;

    const offer = await prisma.ofertas.findUnique({
      where: {
        id: ofertaId
      }
    });
    if (!offer || offer.userId !== req.user?.id) throw new Error('Offer not found');
    
    /* aprobado y entregado (y sus respectivas fechas) se asumen por defecto,
    pero en un siguiente estadio deberian crearse rutas especificas para ello */
    const prestamo = await prisma.prestamos.create({
      data: {
        userId: req.user.id,
        ofertaId: offer.id,
        fecha_aceptacion: new Date(),
        aprobado: true,
        fecha_aprobacion: new Date(),
        entregado: true,
        fecha_desembolso: new Date(),
      }
    });
    const plazo = offer.plazo === 'SEMANAL' ? 7 : 30;

    // Una vez creado el prestamo, se le asigna un calendario de cuotas
    const cuotas = Array.from({ length: offer.quotas }, (_, i) => {
      return {
        descripcion: `Cuota ${i + 1} - Prestamo ${prestamo.id}`,
        fecha_pago: new Date(new Date().setDate(new Date().getDate() + ((i+1) * plazo))),
        monto_inicial: parseFloat((offer.monto / offer.quotas).toFixed(2)),
        monto_pagado: 0,
        pendiente: true,
        prestamoId: prestamo.id
      };
    });
    const dbCuotas = await prisma.cuotas.createMany({
      data: cuotas
    });




    res.status(201).json({ success: true, cuotas: dbCuotas });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating prestamo' });
  }
}