import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");
import { Lesson } from "./validateLesson";

const getAllLessonsByCourseId = async (id: number) => {
  try {
    const pool = new Pool(config);
    const query = 'SELECT title, lesson_id, link FROM public.lesson WHERE course_id = $1; '
    const result = await pool.query(query,[id]);
      if (result.rows.length === 0) {
        return { result: "There are not lesssons for this course", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { error: "Error en la consulta", status: 0 };
  }
};

const getAllLessonsByUserId = async (id:number) => {
    try {
      const pool = new Pool(config);
      const query = 'SELECT title, lesson_id, course_id, link FROM public.lesson WHERE user_id = $1; '
      const result = await pool.query(query,[id]);
      if (result.rows.length === 0) {
        return { result: "There are no lessons created by this user", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
    } catch (error) {
      console.error("Error en la consulta:", error);
      return { error: "Error in query", status: 0 };
    }
  };

const createLesson = async (lesson: Lesson) => {
    const pool = new Pool(config);
  try {
    await pool.query('BEGIN');
    const query =
      'INSERT INTO public.lesson (title, user_id, course_id, link) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [lesson.title, lesson.userId, lesson.courseId, lesson.link];
    const resultQuery = await pool.query(query, values);

    const query2 = 
      'SELECT user_id FROM public.student_course WHERE course_id = $1';
    const resultQuery2 = await pool.query(query2, [lesson.courseId]);
    for (const element of resultQuery2.rows) {
        const query3 =
      'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
      const values = [element.user_id, resultQuery.rows[0].lesson_id , 0]; // Zero indicates not viewed
      await pool.query(query3, values);
      }
      await pool.query('COMMIT');
    return { result: resultQuery.rows[0], status: 1 };
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Error al crear un lesson:", error);
    return { error: "Error al crear un registro", status: 0 };
  }
};

const getLessonById = async (id: number) => {
  try {
    const query = 'SELECT title, user_id, link FROM public.lesson WHERE lesson_id = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return { result: "Row not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return { error: "Error al obtener el registro", status: 0 };
  }
};

const updateLesson = async (lesson: Lesson) => {
  try {
    const query =
      'UPDATE public.lesson SET title = $1, link = $2 WHERE lesson_id = $3 RETURNING title, link;';
    const values = [lesson.title, lesson.link, lesson.lessonId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        message: "Lesson not found",
        parametersReceived: values,
        status: 1
      };
    } else {
      return {result: result.rows[0], status: 1};
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    return { error: "Error al actualizar el registro", status: 0 };
  }
};

const deleteLesson = async (id: number) => {
  try {
    const query =
      'DELETE FROM public.lesson WHERE lesson_id = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Lesson not found." , status: 1};
    } else {
      return { message: "Lesson deleted successfully.", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro (lesson):", error);
    return { error: "Error trying to remove a row", status: 0 };
  }
};

module.exports = { getLessonById,getAllLessonsByUserId, getAllLessonsByCourseId, createLesson, updateLesson, deleteLesson };
