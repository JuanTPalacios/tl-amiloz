import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { revertirPago } from "../controllers/pagos";

const pagosRouter = Router();

// al utilizar auth para el user y params para la transaccion no es necesario utilizar el body
pagosRouter.put('/:transaccionId/revertir',
  authMiddleware,
  revertirPago
);

export default pagosRouter;