import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const {
  createLesson,
  getLesson,
  getAllLessons,
  deleteLesson,
  updateLesson,
} = require("./../models/lessons");

// Ruta POST para crear un nuevo lesson, se le debe de enviar un objeto como el siguiente:
// {"lesson": "calculus", "lessonId": 1009, "courseId": 100}
app.post("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { lesson, lessonId, courseId } = req.body;
    const { result, status } = await createLesson(lesson, lessonId, courseId);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error al crear un registro" });
  }
});

// GET general para obtener todos los lessons, devolverá un arreglo de objetos
app.get("/", authenticateToken, async ( req: Request, res: Response) => {
  try {
    const { result, status } = await getAllLessons();
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error al mostrar los cursos" });
  }
});

// Ruta para obtener un lesson por su ID, se le debe de mandar un id (del tipo int) como parametro
app.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { result, status } = await getLesson(id);
    status ? res.json(result) : res.status(500).json("Error al consultar");
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error al mostrar los cursos" });
  }
});

// Ruta para editar un lesson, se debe de mandar un objeto del tipo:
// {"lesson": "math" , "lessonId": 1009, }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken , async (req: Request, res: Response) => {
  try {
    const { lesson, lessonId, courseId } = req.body;
    console.log(req.body)
    const { message, result, status, parametersReceived } = await updateLesson(lesson, lessonId, courseId);
    if (status) {
      parametersReceived ? res.status(404).json({ message, parametersReceived}) : res.json(result)
      
    } else {
      res.status(500).json({ error: "500. Error al actualizar el registro" });
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

// Ruta para eliminar un registro por su lessonId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteLesson(id);
  if (status) {
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

module.exports = app;
