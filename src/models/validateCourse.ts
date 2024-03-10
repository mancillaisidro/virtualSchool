import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export interface Course{
    courseId: number,
    title: string,
    userId: number
}

const customMessages = {
    'number.integer': "id must be an integer number",
    "numbeer.min": "id must be equal or greater than 100"
}

export const validateCourse = (req: Request, res: Response, next: NextFunction) => {
    const assignmentSchema = Joi.object({
        courseId: Joi.number().min(100).integer(),
        title: Joi.string().required(),
        userId: Joi.number().integer().min(1).required()
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

module.exports = { validateCourse, validateId };
