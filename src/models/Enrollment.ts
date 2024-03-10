import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type 
import { studentCourse } from "./validateStudentEnrollment";


export const createEnrollment = async (studentToEnroll: studentCourse) => {
  try {
    const query =
      'INSERT INTO public.student_lesson (user_id, lesson_id, status) VALUES ($1, $2, $3) RETURNING *';
    const values = [studentToEnroll.userId, studentToEnroll.courseId, 1];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error: any) {
    console.error("Error trying to register a new user: ", error.detail);
    return { error: error.detail, status: 0 };
  }
};

export const updateEnrollment = async (studentToEnroll: studentCourse) => {
    try {
      const query =
        'UPDATE public.student_lesson SET status = $1 WHERE user_id = $2 AND lesson_id = $3 RETURNING *;';
      const values = [1, studentToEnroll.userId, studentToEnroll.userId];
      const pool = new Pool(config);
      const result = await pool.query(query, values);
      return { result: result.rows[0], status: 1 };
    } catch (error: any) {
      console.error("Error trying to register a new user: ", error.detail);
      return { error: error.detail, status: 0 };
    }
  };

 export const getCoursesByUserId = async (id: number) => {
    const pool = new Pool(config);
    try {
      const query = 'SELECT courses.lesson, courses.course, courses."courseId", courses."lessonId" FROM public.courses INNER JOIN public.student_lesson ON courses."courseId" = student_lesson.lesson_id WHERE student_lesson.user_id = $1;';
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return { result: "userId not exist", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
    } catch (error) {
      console.error("Error al obtener el registro:", error);
      return { error: "Error al obtener el registro", status: 0 };
    }
  };

module.exports = { createEnrollment, updateEnrollment, getCoursesByUserId};
