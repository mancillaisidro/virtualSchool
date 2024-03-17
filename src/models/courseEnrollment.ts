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

    // Get all the lessons related to this Course
    const query2 = 'SELECT lesson_id FROM public.lesson WHERE course_id = $1;'; 
    const resultQuery2  = await pool.query(query2, [studentToEnroll.courseId]);
    // for each lesson found, we insert into student_lesson to show this content to the user.
    for (const element of resultQuery2.rows) { //para mostrarle al studen las lecciones que ya has sido creadas previamente
      const query3 =
    'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
    const values3 = [studentToEnroll.userId, element.lesson_id , 0]; // Zero indicates not viewed
    await pool.query(query3, values3);

    // consulta para saber si hay examenes en la lesson
    const query4 = 'SELECT exam_id FROM public.exam WHERE lesson_id = $1;';
    const resultQuery4 = await pool.query(query4, [element.lesson_id]);
    // por cada examen que veamos, vamos a hacer un insert en student_exam para asignarle el examen al student
    for(const element2 of resultQuery4.rows){
      const query5 = 'INSERT INTO public.student_exam (exam_id, user_id, status) VALUES ( $1, $2, $3);';
      const values5 = [element2.exam_id, studentToEnroll.userId, 0 ];
      await pool.query(query5, values5)
    }

    // consulta para saber si hay assignments en la lesson
    const query6 = 'SELECT assignment_id FROM public.assignment WHERE lesson_id = $1;';
    const resultQuery6 = await pool.query(query6, [element.lesson_id]);
    // por cada examen que veamos, vamos a hacer un insert en student_exam para asignarle el examen al student
    for(const element2 of resultQuery6.rows){
      const query7 = 'INSERT INTO public.student_assignment (assignment_id, user_id, status) VALUES ( $1, $2, $3);';
      const values7 = [element2.assignment_id, studentToEnroll.userId, 0 ];
      await pool.query(query7, values7);
    }
    }
    
    await pool.query('COMMIT');
    return { result: resultQuery.rows[0], status: 1 };
  } catch (error: any) {
    await pool.query('ROLLBACK');
    console.error("Error trying to register a new user: ", error);
    return { error: error.detail, status: 0 };
  }
};

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
