import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type 
import { studentLessonToUpdate } from "./validateLessonEnrollment";

export const updateStudentLesson = async (studentEnrolledUpdate: studentLessonToUpdate) => {
    try {
      const query =
        'UPDATE public.student_lesson SET status = $1 WHERE user_id = $2 AND lesson_id = $3 RETURNING *;';
      const values = [studentEnrolledUpdate.status, studentEnrolledUpdate.userId, studentEnrolledUpdate.lessonId];
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

 export const getLessonsByUserIdAndCourseId = async (userId: number, courseId: number) => {
    const pool = new Pool(config);
    try {
      const query = 'SELECT lesson.title, lesson.lesson_id, lesson.link, student_lesson.status FROM public.lesson INNER JOIN public.student_lesson ON lesson.lesson_id = student_lesson.lesson_id WHERE student_lesson.user_id = $1 AND lesson.course_id = $2;';
      const result = await pool.query(query, [userId, courseId]);
      if (result.rows.length === 0) {
        return { result: "There are any Lesson linked to this user and course", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
    } catch (error) {
      console.error("Error al obtener el registro:", error);
      return { error: "Error al obtener el registro", status: 0 };
    }
  };

module.exports = { updateStudentLesson, getLessonsByUserIdAndCourseId};
