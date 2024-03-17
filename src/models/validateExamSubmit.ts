import { NextFunction, Request, Response } from "express";
import Joi from "joi";
export interface ExamSubmit{
    userId: string,
    examId: number,
    fileName: string,
    comment?: string
}

export const validateExamSubmit = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required().integer(),
        examId: Joi.number().min(1).required().integer(),
        fileName: Joi.string().required(),
        comment: Joi.string()
    })
        const { error} = newSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const examSchema = Joi.object({
    id: Joi.number().min(1).required(),
  })
      const { error} = examSchema.validate(req.params, { abortEarly: false });
      if(error){
        const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      next()
};

module.exports = { validateExamSubmit, validateId };
