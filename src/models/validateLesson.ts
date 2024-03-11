import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export interface Lesson{
    lessonId: number,
    courseId: number,
    title: string,
    userId: number,
    link: string
}

const customMessages = {
    'number.integer': "id must be an integer number",
    "numbeer.min": "id must be equal or greater than 100"
}

export const validateLesson = (req: Request, res: Response, next: NextFunction) => {
    const assignmentSchema = Joi.object({
        courseId: Joi.number().min(100).integer().required(),
        title: Joi.string().required(),
        userId: Joi.number().integer().min(1).required(),
        link: Joi.string()
    })
        const { error} = assignmentSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateLessonUpdate = (req: Request, res: Response, next: NextFunction) => {
    const assignmentSchema = Joi.object({
        lessonId: Joi.number().min(1000).integer().required(),
        title: Joi.string().required(),
        link: Joi.string()
    })
        const { error} = assignmentSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const assignmentSchema = Joi.object({
    id: Joi.number().integer().min(1).required().messages(customMessages),
  })
      const { error} = assignmentSchema.validate(req.params, { abortEarly: false });
      if(error){
        const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      next()
};

module.exports = { validateLesson, validateId, validateLessonUpdate };
