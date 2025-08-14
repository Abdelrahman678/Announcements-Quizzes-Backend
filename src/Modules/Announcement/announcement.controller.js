import { Router } from "express";
import {
  getAllAnnouncementsService,
  getAnnouncementByIdService,
  createAnnouncementService,
  updateAnnouncementService,
  deleteAnnouncementService,
} from "./services/announcement.service.js";
import {
  errorHandlerMiddleware,
  authenticationMiddleware,
  validationMiddleware,
} from "../../Middleware/index.middleware.js";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../../Validators/announcement.schema.js";

/* == Announcement Router == */
const announcementController = Router();

/* == authentication middleware == */
/**
 *? commented for testing with frontend as there is no sign-in using email and password in frontend
 * **/
// announcementController.use(authenticationMiddleware());

/* == getAllAnnouncementsController == */
announcementController.get(
  "/get-all-announcements",
  errorHandlerMiddleware(getAllAnnouncementsService)
);
/* == getAnnouncementByIdController == */
announcementController.get(
  "/get-announcement/:id",
  errorHandlerMiddleware(getAnnouncementByIdService)
);
/* == createAnnouncementController == */
announcementController.post(
  "/create-announcement",
  validationMiddleware(createAnnouncementSchema),
  errorHandlerMiddleware(createAnnouncementService)
);
/* == updateAnnouncementController == */
announcementController.put(
  "/update-announcement/:id",
  validationMiddleware(updateAnnouncementSchema),
  errorHandlerMiddleware(updateAnnouncementService)
);
/* == deleteAnnouncementController == */
announcementController.delete(
  "/delete-announcement/:id",
  errorHandlerMiddleware(deleteAnnouncementService)
);

export { announcementController };
