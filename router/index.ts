import { Router, Express } from "express";
import userRouter from './user-router';

const rootRouter = Router();
rootRouter.all('*', (_, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

const setRouting = (app: Express): void => {
  app.use("/user", userRouter);
  app.use(rootRouter);
};

export default setRouting;