import { Router } from "express";

import {
  errorHandlerMiddleware,
  validationMiddleware,
} from "../../Middleware/index.middleware.js";

import {
  signUpService,
  signInService,
  signOutService,
} from "./services/auth.service.js";

import {
  signUpSchema,
  signInSchema,
  signOutSchema,
} from "../../Validators/auth.schema.js";

/* == Auth Router == */
const authController = Router();

/* == signUpController == */
authController.post(
  "/sign-up",
  validationMiddleware(signUpSchema),
  errorHandlerMiddleware(signUpService)
);
/* == signInController == */
authController.post(
  "/sign-in",
  validationMiddleware(signInSchema),
  errorHandlerMiddleware(signInService)
);
/* == signOutController == */
authController.post(
  "/sign-out",
  validationMiddleware(signOutSchema),
  errorHandlerMiddleware(signOutService)
);

export { authController };
