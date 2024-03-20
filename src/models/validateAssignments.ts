import { NextFunction, Request, Response } from "express";
import Joi from "joi";
/* interface Assignment{
    assignmentId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,
}*/

const customMessages = {
    'number.integer': "id must be an integer number",
}

export const validateAssignment = (req: Request, res: Response, next: NextFunction) => {
    const assignmentSchema = Joi.object({
        lessonId: Joi.number().min(1).required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        dueDate: Joi.date().required(),
        userId: Joi.number().min(1).required(),
        pathToDB: Joi.string().required(),
    })
        const { error} = assignmentSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateAssignmenttoUpdate = (req: Request, res: Response, next: NextFunction) => {

  const assignmentUpdateSchema = Joi.object({
      userId: Joi.number().min(0).max(100).required(),
      lessonId: Joi.number().min(1).required(),
      assignmentId: Joi.number().min(1).required(),
      title: Joi.string().required(),
      description: Joi.string().required(),
      dueDate: Joi.date().required(),
  })
      const { error} = assignmentUpdateSchema.validate(req.body, { abortEarly: false });
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

module.exports = { validateAssignment, validateAssignmenttoUpdate, validateId };
