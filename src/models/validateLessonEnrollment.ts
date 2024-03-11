import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export interface studentLessonToUpdate  {
    userId: number,
    lessonId: number,
    status?: number,
}

export const validateStudentLessonUpdate = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required().integer(),
        lessonId: Joi.number().min(1000).required().integer(),
        status: Joi.number().min(0).required().integer()
    })
        const { error} = newSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next();
};
export const validateStudentLessonEnrolled = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required().integer(),
        courseId: Joi.number().min(100).required().integer(),
    })
        const { error} = newSchema.validate(req.query, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next();
};

module.exports = { validateStudentLessonUpdate, validateStudentLessonEnrolled};