import http from 'http';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import setRouting from './router';

export const bootServer = (port: number): http.Server => {
  const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  const app = express();
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cors(corsConfig));

  setRouting(app);
  
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return server;
}