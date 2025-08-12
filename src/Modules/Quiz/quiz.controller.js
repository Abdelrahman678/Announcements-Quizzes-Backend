import { Router } from "express";
import {
  getAllQuizzesService,
  getQuizByIdService,
  createQuizService,
  updateQuizService,
  deleteQuizService,
} from "./services/quiz.service.js";
import {
  errorHandlerMiddleware,
  authenticationMiddleware,
  validationMiddleware,
} from "../../Middleware/index.middleware.js";
import {
  createQuizSchema,
  updateQuizSchema,
} from "../../Validators/quiz.schema.js";

/* == Quiz Router == */
const quizController = Router();

/* == authentication middleware == */
quizController.use(authenticationMiddleware());

/* == getAllQuizzesController == */
quizController.get(
  "/get-all-quizzes",
  errorHandlerMiddleware(getAllQuizzesService)
);
/* == getQuizByIdController == */
quizController.get("/get-quiz/:id", errorHandlerMiddleware(getQuizByIdService));
/* == createQuizController == */
quizController.post(
  "/create-quiz",
  validationMiddleware(createQuizSchema),
  errorHandlerMiddleware(createQuizService)
);
/* == updateQuizController == */
quizController.put(
  "/update-quiz/:id",
  validationMiddleware(updateQuizSchema),
  errorHandlerMiddleware(updateQuizService)
);
/* == deleteQuizController == */
quizController.delete(
  "/delete-quiz/:id",
  errorHandlerMiddleware(deleteQuizService)
);

export { quizController };
