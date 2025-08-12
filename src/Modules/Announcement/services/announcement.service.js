import { Announcement } from "../../../DB/models/index.model.js";

/**
 * Retrieves all non-deleted announcements from the database
 * @async
 * @function getAllAnnouncementsService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing announcements or error message
 */
/* == getAllAnnouncementsService == */
export const getAllAnnouncementsService = async (req, res) => {
  /* Find all announcements */
  const allAnnouncements = await Announcement.find({ isDeleted: false })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
  /* if no announcements found */
  if (!allAnnouncements) {
    return res.status(404).json({
      message: "Announcements not found",
    });
  }
  /* return success response */
  return res.status(200).json({
    message: "Announcements retrieved successfully",
    data: allAnnouncements,
  });
};

/**
 * Retrieves a single announcement by ID if it exists and is not deleted
 * @async
 * @function getAnnouncementByIdService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The ID of the announcement to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing the announcement or error message
 */
/* == getAnnouncementByIdService == */
export const getAnnouncementByIdService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* find not deleted announcement by id */
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  }).populate("createdBy", "username");
  /* if no announcement found return error response */
  if (!announcement) {
    return res.status(404).json({
      message: "Announcement not found",
    });
  }
  /* return success response */
  return res.status(200).json({
    message: "Announcement retrieved successfully",
    data: announcement,
  });
};

/**
 * Creates a new announcement in the database
 * @async
 * @function createAnnouncementService
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing announcement data
 * @param {string} req.body.title - Title of the announcement
 * @param {string} req.body.content - Content of the announcement
 * @param {string} req.body.course - Course ID the announcement belongs to
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user creating the announcement
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing the created announcement or error message
 */
/* == createAnnouncementService == */
export const createAnnouncementService = async (req, res) => {
  /* destructure request body */
  const { title, content, course } = req.body;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;
  /* create announcement */
  const announcement = new Announcement({
    title,
    content,
    course,
    createdBy: _id,
  });
  /* save announcement */
  await announcement.save();
  /* if announcement not created return error response */
  if (!announcement) {
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
  /* return success response */
  return res.status(201).json({
    message: "Announcement created successfully",
    data: announcement,
  });
};

/**
 * Updates an existing announcement if it exists, is not deleted, and user is authorized
 * @async
 * @function updateAnnouncementService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The ID of the announcement to update
 * @param {Object} req.body - Request body containing fields to update
 * @param {string} [req.body.title] - New title (optional)
 * @param {string} [req.body.content] - New content (optional)
 * @param {string} [req.body.course] - New course ID (optional)
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user updating the announcement
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing the updated announcement or error message
 */
/* == updateAnnouncementService == */
export const updateAnnouncementService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* destructure request body */
  const { title, content, course } = req.body;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;
  /* check if no fields are provided */
  if (!title && !content && !course) {
    return res.status(400).json({
      message: "Please provide at least one field to update",
    });
  }
  /* find not deleted announcement by id */
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  });
  /* if no announcement found return error response */
  if (!announcement) {
    return res.status(404).json({
      message: "Announcement not found",
    });
  }
  /* if not authorized return error response */
  if (announcement.createdBy.toString() !== _id.toString()) {
    return res.status(401).json({
      message: "You are not authorized to update this announcement",
    });
  }

  /* update announcement */
  if (title) announcement.title = title;
  if (content) announcement.content = content;
  if (course) announcement.course = course;
  /* save announcement */
  await announcement.save();
  /* return success response */
  return res.status(200).json({
    message: "Announcement updated successfully",
    data: announcement,
  });
};

/**
 * Soft deletes an announcement by setting isDeleted to true
 * @async
 * @function deleteAnnouncementService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The ID of the announcement to delete
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user deleting the announcement
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with success/error message
 */
/* == deleteAnnouncementService (soft delete) == */
export const deleteAnnouncementService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;
  /* find not deleted announcement by id */
  const announcement = await Announcement.findOne({
    _id: id,
    isDeleted: false,
  });
  /* if no announcement found return error response */
  if (!announcement) {
    return res.status(404).json({
      message: "Announcement not found",
    });
  }
  /* if not authorized return error response */
  if (announcement.createdBy.toString() !== _id.toString()) {
    return res.status(401).json({
      message: "You are not authorized to delete this announcement",
    });
  }
  /* soft delete announcement */
  announcement.isDeleted = true;
  announcement.deletedAt = new Date();
  /* save announcement */
  await announcement.save();
  /* return success response */
  return res.status(200).json({
    message: "Announcement soft deleted successfully",
    data: announcement,
  });
};
