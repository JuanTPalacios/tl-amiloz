import { Router } from "express";
import { validateData } from "../middleware/zod-validation";
import { authMiddleware } from "../middleware/authMiddleware";
import { pagoSchema } from "../schemas/prestamosSchemas";
import { registrarPago } from "../controllers/pagos";

const prestamosRouter = Router();

prestamosRouter.post('/:prestamoId/pagos',
  validateData(pagoSchema),
  authMiddleware,  
  registrarPago
);

export default prestamosRouter;