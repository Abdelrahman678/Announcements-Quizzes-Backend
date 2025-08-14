import express from "express";
import { db_connection } from "./DB/connection.js";
import { config } from "dotenv";
import path from "path";
import routerHandler from "./Utils/router-handler.utils.js";
import helmet from "helmet";
import cors from "cors";

// config .env file
config({ path: path.resolve(`.env`) });

cconst allowedOrigins = [
  process.env.FRONTEND_CORS_ORIGIN,
  process.env.FRONTEND_CORS_ORIGIN_PROD,
  process.env.FRONTEND_CORS_ORIGIN_PROD_ACTUAL,
  /^https:\/\/announcements-quizzes-frontend-.*\.vercel\.app$/,  // Updated pattern
  /^https:\/\/announcements-quizzes-frontend\.vercel\.app$/,      // For production
  undefined,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin matches any allowed pattern
    if (allowedOrigins.some(pattern => {
      if (pattern instanceof RegExp) {
        return pattern.test(origin);
      }
      return pattern === origin;
    })) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
/* bootstrap function */
async function bootStrap() {
  /* express app */
  const app = express();

  /* for parsing the request body*/
  app.use(express.json());

  /* use cors */
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));


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
