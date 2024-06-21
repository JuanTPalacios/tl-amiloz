import { Router } from "express";
import { createUser, logInUser } from "../controllers/user";
import { validateData } from "../middleware/zod-validation";
import { offerCreationSchema, userCreationSchema, userLogInSchema } from "../schemas/userSchemas";
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
  ()=>{}
); 
userRouter.post('/:userId/prestamos', ()=>{});

export default userRouter;