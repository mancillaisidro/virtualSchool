import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");
import { Course } from "./validateCourse";

const getAllCourses = async () => {
  try {
    const pool = new Pool(config);
    const queryAll = 'SELECT title, course_id FROM public.course WHERE 1=1; '
    const result = await pool.query(queryAll);
    return { result: result.rows.length == 0 ? "There are no courses yet." : result.rows, status: 1 };
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { error: "Error en la consulta", status: 0 };
  }
};
const getAllCoursesByUserId = async (id:number) => {
    try {
      const pool = new Pool(config);
      const query = 'SELECT title, course_id FROM public.course WHERE user_id = $1; '
      const result = await pool.query(query,[id]);
      if (result.rows.length === 0) {
        return { result: "There are no courses created by this user", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
    } catch (error) {
      console.error("Error en la consulta:", error);
      return { error: "Error in query", status: 0 };
    }
  };

const createCourse = async (course: Course) => {
  try {
    const query =
      'INSERT INTO public.course (title, user_id) VALUES ($1, $2) RETURNING *';
    const values = [course.title, course.userId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error al crear un course:", error);
    return { error: "Error al crear un registro", status: 0 };
  }
};

const getCourseById = async (id: number) => {
  try {
    const query = 'SELECT title, user_id FROM public.course WHERE course_id = $1';
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

const updateCourse = async (course: Course) => {
  try {
    const query =
      'UPDATE public.course SET title = $1 WHERE course_id = $2 RETURNING title';
    const values = [course.title, course.courseId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        message: "Course not found",
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

const deleteCourse = async (id: number) => {
  try {
    const query =
      'DELETE FROM public.course WHERE course_id = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Course not found." , status: 1};
    } else {
      return { message: "Course deleted successfully.", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return { error: "Error trying to remove a row", status: 0 };
  }
};

module.exports = { createCourse, getCourseById,getAllCoursesByUserId, getAllCourses, updateCourse, deleteCourse };
