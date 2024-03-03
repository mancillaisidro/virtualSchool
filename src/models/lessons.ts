import { Pool } from "pg";
import { NextFunction, Request, Response } from "express";
const config = require("./../routes/dbProductionConfig");

const createLesson = async (
  lessonName: string,
  lessonId: number,
  courseId: number
) => {
  try {
    const query =
      'INSERT INTO public.courses (lesson, "lessonId", "courseId") VALUES ($1, $2, $3) RETURNING *';
    const values = [lessonName, lessonId, courseId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error al crear un course:", error);
    return { error: "Error al crear un registro", status: 0 };
  }
};

const getAllLessons = async () => {
  try {
    const query =
      'SELECT lesson, "lessonId", "courseId" FROM public.courses WHERE "lessonId" IS NOT NULL ORDER BY "lessonId"; ';
    const pool = new Pool(config);
    const result = await pool.query(query);
    return { result: result.rows, status: 1 };
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return { error: "Error al obtener el registro", status: 0 };
  }
};

const getLesson = async (id: number) => {
  try {
    const query =
      'SELECT lesson, "lessonId", "courseId" FROM public.courses WHERE "lessonId" = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return { result: "Lesson not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return { error: "Error al obtener el registro", status: 0 };
  }
};

const updateLesson = async (
  lessonName: string,
  lessonId: number,
  courseId: number
) => {
  try {
    const query =
      'UPDATE public.courses SET lesson = $1, "lessonId" = $2, "courseId" = $3 WHERE "lessonId" = $2 RETURNING *';
    const values = [lessonName, lessonId, courseId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        message: "Registro no encontrado",
        parametersReceived: values,
        status: 1,
      };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    return { error: "Error al actualizar el registro", status: 0 };
  }
};

const deleteLesson = async (id: number) => {
  try {
    const query =
      'DELETE FROM public.courses WHERE "lessonId" = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Lesson not found", status: 1 };
    } else {
      return { message: "Lesson eliminado correctamente", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return { error: "Error al eliminar el registro", status: 0 };
  }
};

const checkIfLessonExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.body.lessonId ?? 0;
    if (id === null || id === "" || id === undefined)
      res.status(401).json({ message: "lessonId is null, undefined or empty" });
    try {
      console.log(req.body);
      console.log(req.query);
      console.log(req.params);
      const query = 'SELECT lesson, "lessonId" FROM public.courses WHERE "lessonId" = $1';
      const pool = new Pool(config);
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(401).json("lessonId not found");
      } else {
        next();
      }
    } catch (error) {
      console.error("Error al obtener el registro:", error);
      res
        .status(401)
        .json(
          "Database connection error, please go to the terminal to see more details."
        );
    }
};

async function getFileName(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const id = req.query.lessonId ?? 0;
    if (id === null || id === "" || id === undefined)
      res.status(401).json({ message: "lessonId is null, undefined or empty" });
    try {
      const query =
        'SELECT "lessonId", "pathFile" FROM public.courses WHERE "lessonId" = $1';
      const pool = new Pool(config);
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        res.status(401).json("lessonId not found");
      } else {
        req.params.pathFile = result.rows[0].pathFile;
        next();
      }
    } catch (error) {
      console.error("Error al obtener el registro:", error);
      res
        .status(401)
        .json(
          "Database connection error, please go to the terminal to see more details."
        );
    }
  }
const savePathInDB = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query =
      'UPDATE public.courses SET "pathFile" = $1 WHERE "lessonId" = $2 RETURNING *';
    const values = [req.body.pathToDB, req.body.lessonId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.json("Registro no encontrado para actualizar");          
    } else {
      next()
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.json("Database error, go to the terminal to see more info about this error."); 
  }
}
module.exports = {
  createLesson,
  getLesson,
  getAllLessons,
  updateLesson,
  deleteLesson,
  checkIfLessonExist,
  savePathInDB,
  getFileName
};
