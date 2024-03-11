import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type 
import { studentCourse } from "./validateStudentEnrollment";

export const createCourseEnrollment = async (studentToEnroll: studentCourse) => {
  const pool = new Pool(config);
  try {
    await pool.query('BEGIN');
    const query =
      'INSERT INTO public.student_course (user_id, course_id, status) VALUES ($1, $2, $3) RETURNING *';
    const values = [studentToEnroll.userId, studentToEnroll.courseId, 1]; //1 indicates is enrolled
    const resultQuery = await pool.query(query, values);
    const query2 = 'SELECT lesson_id FROM public.lesson WHERE course_id = $1;';
    const resultQuery2  = await pool.query(query2, [studentToEnroll.courseId])
    for (const element of resultQuery2.rows) {
      const query3 =
    'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
    const values = [studentToEnroll.userId, element.lesson_id , 0]; // Zero indicates not viewed
    await pool.query(query3, values);
    }
    await pool.query('COMMIT');
    return { result: resultQuery.rows[0], status: 1 };
  } catch (error: any) {
    await pool.query('ROLLBACK');
    console.error("Error trying to register a new user: ", error.detail);
    return { error: error.detail, status: 0 };
  }
};
// 
export const updateStudentCourseEnrollment = async (studentEnrolledUpdate: studentCourse) => {
    try {
      const query =
        'UPDATE public.student_course SET status = $1 WHERE user_id = $2 AND course_id = $3 RETURNING *;';
      const values = [studentEnrolledUpdate.status, studentEnrolledUpdate.userId, studentEnrolledUpdate.courseId];
      const pool = new Pool(config);
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return {
          message: "Row not found",
          parametersReceived: values,
          status: 1
        };
      } else {
        return {result: result.rows[0], status: 1};
      }
    } catch (error: any) {
      console.error("Error trying to register a new user: ", error.detail);
      return { error: error.detail, status: 0 };
    }
  };

 export const getCoursesByUserId = async (id: number) => {
    const pool = new Pool(config);
    try {
      const query = 'SELECT course.title, course.course_id FROM public.course INNER JOIN public.student_course ON course.course_id = student_course.course_id WHERE student_course.user_id = $1;';
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

module.exports = { createCourseEnrollment, updateStudentCourseEnrollment, getCoursesByUserId};
