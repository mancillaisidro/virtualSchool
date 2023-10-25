import express, { Request, Response } from "express";
import { Pool } from "pg";
const app = express.Router();
const config = require("./dbProductionConfig");

// GET general para obtener todos los courses y lessons, devolverá un arreglo de objetos
app.get("/", async (req: Request, res: Response) => {
  // Ejemplo de consulta a la base de datos

  const queryresponse = new Pool(config);
  queryresponse.query(
    'SELECT course, lesson, "courseId", "lessonId" FROM public.courses',
    (error, result) => {
      if (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ error: "Error en la consulta" });
      } else {
        res.json(result.rows);
      }
    }
  );
});
// Ruta POST para crear un nuevo course, se le debe de enviar un objeto como el siguiente:
// {"courseId": 1009, "lessonId": 100, "courseName": "math", "lessonName": "calculus" }
app.post("", async (req: Request, res: Response) => {
  try {
    const { course, lesson, courseId, lessonId } = req.body;
    const query =
      'INSERT INTO public.courses (course, lesson, "courseId", "lessonId") VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [course, lesson, courseId, lessonId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error al crear un registro" });
  }
});

// Ruta para obtener un lesson por su ID, se le debe de mandar un id (del tipo int) como parametro
app.get("/lesson/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM public.courses WHERE "lessonId" = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Registro no encontrado" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error al obtener el registro" });
  }
});
// Ruta para obtener un lesson por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM public.courses WHERE "courseId" = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Registro no encontrado" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ error: "Error al obtener el registro" });
  }
});
// Ruta para eliminar un registro por su courseId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query =
      'DELETE FROM public.courses WHERE "courseId" = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Course not found" });
    } else {
      res.json({ message: "Registro eliminado correctamente" });
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    res.status(500).json({ error: "Error al eliminar el registro" });
  }
});
// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"courseId": 1009, "lessonId": 100, "courseName": "math", "lessonName": "calculus" }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado

app.put("", async (req: Request, res: Response) => {
  try {
    const { courseName, lessonName, lessonId, courseId } = req.body;
    const query =
      'UPDATE public.courses SET course = $1, lesson = $2, "lessonId" = $3, "courseId" = $4 WHERE "courseId" = $4 RETURNING *';
    const values = [courseName, lessonName, lessonId, courseId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Registro no encontrado",
        parametersReceived: values,
      });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

module.exports = app;
