import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export interface studentCourse  {
    userId: number,
    courseId: number,
    status?: number
}

export const validateStudentCourse = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required(),
        courseId: Joi.number().min(1).required(),
        status: Joi.number().min(0).required()
    })
        const { error} = newSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next();
};
export const validateUpdateStudentCourse = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required(),
        courseId: Joi.number().min(1).required()
    })
        const { error} = newSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next();
};

module.exports = { validateStudentCourse, validateUpdateStudentCourse};