import dotenv from "dotenv";
import { bootServer } from "./server";

dotenv.config();

const port = Number(process.env.PORT);

(async () => {
  try {
    if (!port || isNaN(port)) {
      throw new Error('PORT is not defined');
    }
    bootServer(port);
  } catch (e) {
    console.log(e);
  }
})();