import { Router } from "express";
import { addOffer, addPrestamo, createUser, logInUser } from "../controllers/user";
import { validateData } from "../middleware/zod-validation";
import { userCreationSchema, userLogInSchema } from "../schemas/userSchemas";
import { offerCreationSchema, prestamoCreationSchema } from "../schemas/prestamosSchemas";
import { authMiddleware } from "../middleware/authMiddleware";
import isAdminUserMiddleware from "../middleware/isAdminMiddleware";

const userRouter = Router();

userRouter.post('/', validateData(userCreationSchema), createUser);
userRouter.post('/login', validateData(userLogInSchema), logInUser);
userRouter.post(
  '/:userId/ofertas',
  validateData(offerCreationSchema),
  authMiddleware,
  isAdminUserMiddleware,
  addOffer
);
// no es necesario userId en params ya que se obtiene del token
userRouter.post('/prestamos',
  validateData(prestamoCreationSchema),
  authMiddleware,
  addPrestamo
);

export default userRouter;