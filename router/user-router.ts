import { Router } from "express";
// import authMiddleware from '../middleware/auth-middleware';
// import { createUser, loginUser } from '../controller/user-controller';

const userRouter = Router();

// userRouter.post('/signup', createUser);
// userRouter.post('/login', loginUser);
// userRouter.get('/logout', authMiddleware, logoutUser);
// userRouter.get('/me', authMiddleware, getMe);
userRouter.get('/', (_, res) => {
  return res.status(200).json({ message: 'User Router' });
});

export default userRouter;