import { Router } from "express";
import { createUser } from "../controllers/user";
// import authMiddleware from '../middleware/auth-middleware';

const userRouter = Router();

userRouter.post('/', createUser);
userRouter.post('/:userId/ofertas', ()=>{}); // agregar auth & admin middleware
userRouter.post('/:userId/prestamos', ()=>{}); // agregar auth & admin middleware

export default userRouter;