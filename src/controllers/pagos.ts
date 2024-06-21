import { Response } from 'express';
import { Cuotas, PrismaClient } from '@prisma/client';
import { AuthRequest } from '../utils/types';

const prisma = new PrismaClient();

export const registrarPago = async (req: AuthRequest, res: Response) => {
  try {
    const { monto } = req.body;
    const { prestamoId } = req.params;

    if (!monto || !prestamoId || !parseInt(prestamoId)) throw new Error('Missing data');
    if (monto <= 0) throw new Error('Invalid amount');
    if (!req.user) throw new Error('User not found');
    const { id } = req.user;

    const prestamo = await prisma.prestamos.findFirst({
      where: {
        id: parseInt(prestamoId),
      }
    });
    if (!prestamo || prestamo.userId !== id) throw new Error('Loan not found');

    const cuotas = await prisma.cuotas.findMany({
      where: {
        prestamoId: parseInt(prestamoId),
        pendiente: true
      },
      orderBy: {
        fecha_pago: 'asc'
      }
    });

    // saldo a descontar
    const montoPendiente = cuotas.reduce((acc, cuota) => acc + (cuota.monto_inicial - cuota.monto_pagado), 0);
    
    if (monto > montoPendiente) throw new Error('Invalid amount');
    let restante = monto;

    // Next steps, procesar con proveedor pago el monto a pagar

    // este proceso revisa las cuotas pendientes para poder realizar abonos parciales y/o a mas de 1 cuota
    const cuotasAPagar: (Cuotas & {restante?: number})[] = [];
    while (restante > 0) {
      const cuota = cuotas.shift();
      if (!cuota) break;
      if (cuota.monto_inicial - cuota.monto_pagado <= restante) {
        cuotasAPagar.push({
          ...cuota,
          monto_pagado: cuota.monto_inicial,
          pendiente: false,
          restante: cuota.monto_inicial - cuota.monto_pagado
        });
        restante -= cuota.monto_inicial - cuota.monto_pagado;
      } else {
        cuotasAPagar.push({
          ...cuota,
          monto_pagado: cuota.monto_pagado + restante
        });
        restante = 0;
      }
    }

    const result = cuotasAPagar.map(async (cuota) => {
      const cuotas = await prisma.cuotas.update({
        where: {
          id: cuota.id
        },
        data: {
          monto_pagado: cuota.monto_pagado,
          pendiente: cuota.pendiente,
        }
      });
      const transacciones = await prisma.transacciones.create({
        data: {
          monto: cuota.restante || cuota.monto_pagado,
          fecha: new Date(),
          userId: id,
          cuotaId: cuota.id,
          descripcion: `Pago de cuota ${cuota.id} - Prestamo ${prestamoId}`,
          billingReceipt: '1234567890', // Una vez incorporado el proveedor de pagos, se debe guardar el recibo de pago
        }
      });
      return { cuotas, transacciones };
    });
    await Promise.all(result);

    res.status(201).json({ success: true, cuotas: cuotasAPagar });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error creating payment' });
  }
};

export const revertirPago = async (req: AuthRequest, res: Response) => {
  try {
    const { transaccionId } = req.params;
    if (!transaccionId || !parseInt(transaccionId)) throw new Error('Missing data');
    if (!req.user) throw new Error('User not found');
    const { id } = req.user;

    const transaccion = await prisma.transacciones.findFirst({
      where: {
        id: parseInt(transaccionId)
      },
      include: {
        Cuotas: true
      }
    });

    if (!transaccion || transaccion.userId !== id || transaccion.reverted) throw new Error('Payment not found');

    const cuota = await prisma.cuotas.update({
      where: {
        id: transaccion.cuotaId
      },
      data: {
        monto_pagado: {
          decrement: transaccion.monto
        },
        pendiente: true
      }
    });

    await prisma.transacciones.update({
      where: {
        id: transaccion.id
      },
      data: {
        reverted: true
      }
    });

    res.status(200).json({ success: true, cuota });

  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, error: 'There was an error reverting payment' });
  }
};