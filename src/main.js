import express from "express";
import { db_connection } from "./DB/connection.js";
import { config } from "dotenv";
import path from "path";
import routerHandler from "./Utils/router-handler.utils.js";
import helmet from "helmet";
// import cors from "cors";

// config .env file
config({ path: path.resolve(`.env`) });

async function bootStrap() {
  /* express app */
  const app = express();

  /* for parsing the request body*/
  app.use(express.json());

  /* use cors commented for now */
  // app.use(cors());

  /* use helmet to secure the app headers*/
  app.use(helmet());

  /* routerHandler */
  routerHandler(app);

  /* db connection */
  db_connection();

  /* server started */
  app.listen(process.env.PORT, () => {
    console.log(`Server Started on port ${process.env.PORT}`);
  });
}

export default bootStrap;
