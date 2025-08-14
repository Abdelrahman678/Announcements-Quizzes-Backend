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
  process.env.FRONTEND_CORS_ORIGIN_PROD_ACTUAL,
  /\.vercel\.app$/,
  undefined,
].filter(Boolean);
/* bootstrap function */
async function bootStrap() {
  /* express app */
  const app = express();

  /* for parsing the request body*/
  app.use(express.json());
  console.log(allowedOrigins);

  /* use cors */
  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
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
