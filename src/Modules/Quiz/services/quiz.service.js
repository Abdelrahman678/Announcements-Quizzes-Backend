import { Quiz } from "../../../DB/models/index.model.js";

/**
 * Retrieves all non-deleted quizzes from the database
 * @async
 * @function getAllQuizzesService
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing quizzes or error message
 */
/* == getAllQuizzesService == */
export const getAllQuizzesService = async (req, res) => {
  /* Find all quizzes */
  const allQuizzes = await Quiz.find({ isDeleted: false })
    .populate("createdBy", "username")
    .sort({ createdAt: -1 });
  /* if no quizzes found */
  if (!allQuizzes) {
    return res.status(404).json({
      message: "Quizzes not found",
    });
  }
  /* return success response */
  return res.status(200).json({
    message: "Quizzes retrieved successfully",
    data: allQuizzes,
  });
};

/**
 * Retrieves a single quiz by ID if it exists and is not deleted
 * @async
 * @function getQuizByIdService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The ID of the quiz to retrieve
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object containing the quiz or error message
 */
/* == getQuizByIdService == */
export const getQuizByIdService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* find not deleted quiz by id */
  const quiz = await Quiz.findOne({
    _id: id,
    isDeleted: false,
  }).populate("createdBy", "username");
  /* if no quiz found return error response */
  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    });
  }
  /* return success response */
  return res.status(200).json({
    message: "Quiz retrieved successfully",
    data: quiz,
  });
};

/**
 * Creates a new quiz in the database
 * @async
 * @function createQuizService
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing quiz data
 * @param {string} req.body.title - Title of the quiz
 * @param {string} req.body.course - ID of the course this quiz belongs to
 * @param {Array<Object>} req.body.questions - Array of question objects
 * @param {string} req.body.questions[].questionText - The text of the question
 * @param {string[]} req.body.questions[].options - Array of possible answers
 * @param {number} req.body.questions[].correctAnswer - Index of the correct answer in options array
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user creating the quiz
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with created quiz data or error message
 * @throws {Error} If quiz creation fails
 */
/* == createQuizService == */
export const createQuizService = async (req, res) => {
  /* destructure request body */
  const { title, course, questions } = req.body;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;

  /* check if questions is an array and not empty */
  if (!questions || !questions.length) {
    return res.status(400).json({
      message: "At least one question is required",
    });
  }
  const questionsArray = questions.map((question) => {
    return {
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
    };
  });
  /* create quiz */
  const quiz = new Quiz({
    title,
    course,
    questions: questionsArray,
    createdBy: _id,
  });
  /* save quiz */
  await quiz.save();
  /* if quiz not created return error response */
  if (!quiz) {
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    });
  }
  /* return success response */
  return res.status(201).json({
    message: "Quiz created successfully",
    data: quiz,
  });
};

/**
 * Updates an existing quiz with new data
 * @async
 * @function updateQuizService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - ID of the quiz to update
 * @param {Object} req.body - Request body containing fields to update
 * @param {string} [req.body.title] - New title for the quiz (optional)
 * @param {string} [req.body.course] - New course ID for the quiz (optional)
 * @param {Array<Object>} [req.body.questions] - New array of question objects (optional)
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user updating the quiz
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with updated quiz data or error message
 * @throws {Error} If quiz update fails or user is unauthorized
 */
/* == updateQuizService == */
export const updateQuizService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* destructure request body */
  const { title, course, questions } = req.body;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;
  /* check if no fields are provided */
  if (!title && !course && !questions) {
    return res.status(400).json({
      message: "Please provide at least one field to update",
    });
  }
  /* find not deleted quiz by id */
  const quiz = await Quiz.findOne({
    _id: id,
    isDeleted: false,
  });
  /* if no quiz found return error response */
  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    });
  }
  /* if not authorized return error response */
  if (quiz.createdBy.toString() !== _id.toString()) {
    return res.status(401).json({
      message: "You are not authorized to update this quiz",
    });
  }
  /* update quiz */
  if (title) quiz.title = title;
  if (course) quiz.course = course;
  if (questions) {
    if (!questions || !questions.length) {
      return res
        .status(400)
        .json({ message: "At least one question is required" });
    }
    const questionsArray = questions.map((question) => {
      return {
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
      };
    });
    quiz.questions = questionsArray;
  }
  /* save quiz */
  await quiz.save();
  /* return success response */
  return res.status(200).json({
    message: "Quiz updated successfully",
    data: quiz,
  });
};

/**
 * Soft deletes a quiz by setting isDeleted to true
 * @async
 * @function deleteQuizService
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - The ID of the quiz to delete
 * @param {Object} req.loggedInUser - Authenticated user object
 * @param {string} req.loggedInUser._id - ID of the user deleting the quiz
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} Response object with success/error message
 */
/* == deleteQuizService (soft delete) == */
export const deleteQuizService = async (req, res) => {
  /* destructure request params */
  const { id } = req.params;
  /* destructure loggedInUser */
  const { _id } = req.loggedInUser;
  /* find not deleted quiz by id */
  const quiz = await Quiz.findOne({
    _id: id,
    isDeleted: false,
  });
  /* if no quiz found return error response */
  if (!quiz) {
    return res.status(404).json({
      message: "Quiz not found",
    });
  }
  /* if not authorized return error response */
  if (quiz.createdBy.toString() !== _id.toString()) {
    return res.status(401).json({
      message: "You are not authorized to delete this quiz",
    });
  }
  /* soft delete quiz */
  quiz.isDeleted = true;
  quiz.deletedAt = new Date();
  /* save quiz */
  await quiz.save();
  /* return success response */
  return res.status(200).json({
    message: "Quiz soft deleted successfully",
    data: quiz,
  });
};
