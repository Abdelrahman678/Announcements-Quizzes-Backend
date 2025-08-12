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
} from "../../Middleware/index.middleware.js";

/* == Announcement Router == */
const announcementController = Router();

/* == authentication middleware == */
announcementController.use(authenticationMiddleware());

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
  errorHandlerMiddleware(createAnnouncementService)
);
/* == updateAnnouncementController == */
announcementController.put(
  "/update-announcement/:id",
  errorHandlerMiddleware(updateAnnouncementService)
);
/* == deleteAnnouncementController == */
announcementController.delete(
  "/delete-announcement/:id",
  errorHandlerMiddleware(deleteAnnouncementService)
);

export { announcementController };
