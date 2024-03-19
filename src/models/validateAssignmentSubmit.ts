import { NextFunction, Request, Response } from "express";
import Joi from "joi";
export interface AssignmentSubmit{
    userId: number,
    assignmentId: number,
    fileName: string,
    comment?: string
}
export interface AssigmentGrade{
  submitionId: number,
  score:number,
  teacherId: number
}
export const validateAssignmentSubmit = (req: Request, res: Response, next: NextFunction) => {
    const newSchema = Joi.object({
        userId: Joi.number().min(1).required().integer(),
        assignmentId: Joi.number().min(1).required().integer(),
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

export const validateAssignmentGrade = (req: Request, res: Response, next: NextFunction) => {
  const newSchema = Joi.object({
      teacherId: Joi.number().min(1).required().integer(),
      submitionId: Joi.number().min(1).required().integer(),
      score: Joi.number().min(1).required().integer().max(100),
  })
      const { error} = newSchema.validate(req.body, { abortEarly: false });
      if(error){
        const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      next()
};
module.exports = { validateAssignmentSubmit, validateId, validateAssignmentGrade };
