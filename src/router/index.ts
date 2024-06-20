import { Router, Express } from "express";
import userRouter from './user-router';
import pagosRouter from "./pagos-router";
import prestamosRouter from "./prestamos-router";

const rootRouter = Router();
rootRouter.all('*', (_, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

const setRouting = (app: Express): void => {
  app.use("/usuarios", userRouter);
  app.use("/pagos", pagosRouter);
  app.use("/prestamos", prestamosRouter);
  app.use(rootRouter);
};

export default setRouting;