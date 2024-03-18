import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type User
interface User{
    email: string,
    password: string,
    userType: number
  }
const userPermissions= [
    ["createExamSubmition", "createAssignmentSubmition"],
    ["createCourse", "createLesson", "createExam", "createAssignment", "gradeExam", "gradeAssignment"],
    ["createExamSubmition", "createAssignmentSubmition", "createCourse", "createLesson", "createExam", "createAssignment", "gradeExam", "gradeAssignment"]
];

export const emailExist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = 'SELECT id FROM public.user WHERE mail = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [req.body.email]);
    result.rows.length === 0 ? next() : res.json({result:'Email already registered, sign in or create a new user.', status: 1});
  } catch (error) {
    console.error("Errror trying to get a row in emailExistFucntion:", error);
    return { error: "Errror trying to get a row:", status: 0 };
  }
};

export const userIdExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = 'SELECT id FROM public.user WHERE id = $1';
      const pool = new Pool(config);
      const result = await pool.query(query, [req.body.email]);
      result.rows.length === 0 ? next() : res.json({result:'User Id does not exist.', status: 1});
    } catch (error) {
      console.error("Errror trying to get a row:", error);
      return { error: "Errror trying to get a row:", status: 0 };
    }
};

  export const isUserAuthTo = async (action: string, userId: number) => {
    console.log(userId)
    try {
      const query = 'SELECT user_type FROM public.user WHERE id = $1';
      const pool = new Pool(config);
      const result = await pool.query(query, [userId]);
      if(result.rows.length === 0){
        return { isAllowed : false }
      } else{
        const usrType = result.rows[0].user_type;
        return { isAllowed: userPermissions[usrType].includes(action)}
      }
    } catch (error) {
      console.error("Errror trying to get a row in isUserAuthFunction:", error);
      return { error: "Errror trying to get a row:", status: 0 };
    }
};
export const getAllUsers = async () => {
    try {
      const query = 'SELECT id, name, mail FROM public.user;';
      const pool = new Pool(config);
      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return { result: "There are no users registered", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }  
    } catch (error) {
      console.error("Errror trying to get a row:", error);
      return { error: "Errror trying to get a row:", status: 0 };
    }
};
module.exports = { emailExist, isUserAuthTo, getAllUsers};
