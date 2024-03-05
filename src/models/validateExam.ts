import { NextFunction, Request, Response } from "express";
import Joi from "joi";
/* interface Exam{
    examId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,
}*/

export const validateExam = (req: Request, res: Response, next: NextFunction) => {
    const examSchema = Joi.object({
        lessonId: Joi.number().min(1).required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        dueDate: Joi.date().required(),
        userId: Joi.number().min(1).required()
    })
        const { error} = examSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateExamtoUpdate = (req: Request, res: Response, next: NextFunction) => {

  const examUpdateSchema = Joi.object({
      userId: Joi.number().min(0).max(100).required(),
      lessonId: Joi.number().min(1).required(),
      examId: Joi.number().min(1).required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      dueDate: Joi.date().required(),
  })
      const { error} = examUpdateSchema.validate(req.body, { abortEarly: false });
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

module.exports = { validateExam, validateExamtoUpdate, validateId };
