import Joi from "joi";

/* createQuizSchema */
export const createQuizSchema = {
  body: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
      "string.base": "Title must be a string",
    }),
    course: Joi.string().required().messages({
      "any.required": "Course is required",
      "string.base": "Course must be a string",
    }),
    questions: Joi.array().required().messages({
      "any.required": "Questions are required",
      "array.base": "Questions must be an array",
    }),
  }),
};

/* updateQuizSchema */
export const updateQuizSchema = {
  body: Joi.object({
    title: Joi.string().messages({
      "string.base": "Title must be a string",
    }),
    course: Joi.string().messages({
      "string.base": "Course must be a string",
    }),
    questions: Joi.array().messages({
      "array.base": "Questions must be an array",
    }),
  }),
};
