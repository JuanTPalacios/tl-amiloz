import { Router } from "express";
// import authMiddleware from '../middleware/auth-middleware';

const pagosRouter = Router();

pagosRouter.post('/:paymentId/revertir', ()=>{}); // agregar auth & admin middleware

export default pagosRouter;