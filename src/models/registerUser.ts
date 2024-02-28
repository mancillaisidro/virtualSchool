import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

// we define the object type User
interface User{
    mail: string,
    name: string,
    password: string,
    userType: string
  }

const getAllCourses = async () => {
  try {
    const pool = new Pool(config);
    const queryAll = 'SELECT course, "courseId" FROM public.courses WHERE "lessonId" IS NULL; '
    const result = await pool.query(queryAll);
    return { result: result.rows, status: 1 };
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { error: "Error en la consulta", status: 0 };
  }
};

export const createUser = async (mail: string, name: string, userType: string, password: string) => {
  try {
    const query =
      'INSERT INTO public.user (mail, name, user_type, password) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [mail, name, userType, password];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error trying to register a new user: ", error);
    return { error: "Error trying to register a new user", status: 0 };
  }
};

export const getUser = async (id: number) => {
  try {
    const query = 'SELECT * FROM public.user WHERE id = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return { result: "User not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return { error: "Error al obtener el registro", status: 0 };
  }
};

const updateCourse = async (courseName: string, courseId: number) => {
  try {
    const query =
      'UPDATE public.courses SET course = $1, "courseId" = $2 WHERE "courseId" = $2 AND "lessonId" IS NULL RETURNING *';
    const values = [courseName, courseId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        message: "Registro no encontrado",
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
      'DELETE FROM public.courses WHERE "courseId" = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Course not found" , status: 1};
    } else {
      return { message: "Course eliminado correctamente", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return { error: "Error al eliminar el registro", status: 0 };
  }
};

module.exports = { createUser, getUser, getAllCourses, updateCourse, deleteCourse };
