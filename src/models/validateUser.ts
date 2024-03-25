import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const userSchema = Joi.object({
        email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
        name: Joi.string().alphanum().min(5).max(25).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
        userType: Joi.number().integer().min(0).required()
    })
        const { error} = userSchema.validate(req.body, { abortEarly: false });
        if(error){
          const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
          return res.status(400).json({ error: errorMessage });
        }
        next()
};

export const validateId = (req: Request, res: Response, next: NextFunction) => {

  const idSchema = Joi.object({
      id: Joi.number().required().min(0).max(100).integer()
  })
      const { error} = idSchema.validate(req.params, { abortEarly: false });
      if(error){
        const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      next()
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const userSchema = Joi.object({
      email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required(),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      repeat_password: Joi.ref('password'),
      userType: Joi.number().min(0).integer().required()
  })
      const { error} = userSchema.validate(req.body, { abortEarly: false });
      if(error){
        const errorMessage = error.details.map((err: { message: any; }) => err.message).join(', ');
        return res.status(400).json({ error: errorMessage });
      }
      next()
};

module.exports = { validateUser, validateId, validateLogin };
