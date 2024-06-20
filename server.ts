import http from 'http';
import express from 'express';

export const bootServer = (port: number): http.Server => {
  const app = express();

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return server;
}