import Joi from "joi";

/* createAnnouncementSchema */
export const createAnnouncementSchema = {
  body: Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
      "string.base": "Title must be a string",
    }),
    content: Joi.string().required().messages({
      "any.required": "Content is required",
      "string.base": "Content must be a string",
    }),
    course: Joi.string().required().messages({
      "any.required": "Course is required",
      "string.base": "Course must be a string",
    }),
  }),
};

/* updateAnnouncementSchema */
export const updateAnnouncementSchema = {
  body: Joi.object({
    title: Joi.string().messages({
      "string.base": "Title must be a string",
    }),
    course: Joi.string().messages({
      "string.base": "Course must be a string",
    }),
    content: Joi.string().messages({
      "string.base": "Content must be a string",
    }),
  }),
};
