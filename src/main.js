import express from "express";
import { db_connection } from "./DB/connection.js";
import { config } from "dotenv";
import path from "path";
import routerHandler from "./Utils/router-handler.utils.js";
import helmet from "helmet";
import cors from "cors";

// config .env file
config({ path: path.resolve(`.env`) });

const allowedOrigins = [
  process.env.FRONTEND_CORS_ORIGIN,
  process.env.FRONTEND_CORS_ORIGIN_PROD,
  process.env.FRONTEND_CORS_ORIGIN_PROD_ACTUAL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow requests like Postman
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

/* bootstrap function */
async function bootStrap() {
  /* express app */
  const app = express();

  /* for parsing the request body*/
  app.use(express.json());

  /* use cors */
  app.use(cors(corsOptions));



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
