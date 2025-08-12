// import { rateLimit } from "express-rate-limit";
import {
  authController,
  announcementController,
} from "../Modules/index.modules.controller.js";
/* rate Limiter commented for now */
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   limit: 15,
//   message: {
//     message: "Too many requests, please try again later",
//   },
//   legacyHeaders: false,
// });

const routerHandler = (app) => {
  /* apply limiter to all routes */
  // app.use(limiter);

  /* == Home Router == */
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Welcome to Announcements Quizzes Dashboard",
    });
  });
  /* == Auth Router == */
  app.use("/auth", authController);
  /* == Announcement Router == */
  app.use("/announcement", announcementController);

  /* == Error 404 Handler == */
  app.use((req, res) => {
    res.status(404).json({
      message: "Error 404: Page Not Found",
    });
  });
};

export default routerHandler;
