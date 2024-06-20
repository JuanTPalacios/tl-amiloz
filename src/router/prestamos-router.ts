import { Router } from "express";
// import authMiddleware from '../middleware/auth-middleware';

const prestamosRouter = Router();

prestamosRouter.post('/:loanId/pagos', ()=>{}); // agregar auth & admin middleware

export default prestamosRouter;