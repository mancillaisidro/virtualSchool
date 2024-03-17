import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Lesson, validateLesson, validateId, validateLessonUpdate } from "../models/validateLesson";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const { 
  getLessonById,
  getAllLessonsByUserId,
  createLesson,
  getAllLessonsByCourseId,
  deleteLesson,
  updateLesson
} = require("./../models/lessonModel");

// GET to get ALL the Lessons.
app.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const { result, status } = await getAllLessonsByCourseId(id);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error executing query" });
    }
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error " });
  }
});

// Ruta POST para crear un nuevo lesson, se le debe de enviar un objeto como el siguiente:
// POST to create a new lesson, a object type Couse should be sent in the body
// {"userId":1,"title":"English", "link": "google.com", "courseId": 102}
app.post("", authenticateToken, validateLesson, async (req: Request, res: Response) => {
  try {
    const lesson: Lesson = req.body;
    const { result, status } = await createLesson(lesson);
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

// Ruta para obtener un lesson por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getLessonById(id);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para obtener un lesson por el user_id, se le debe de mandar un id(del tipo int) como parametro
app.get("/byCreator/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { result, status } = await getAllLessonsByUserId(id);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  });

// Ruta para eliminar un registro por su lessonId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteLesson(id);
  if (status) {
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"title": "math", "link": "http://google.com/" , "lesson_id": 1009, }
// el lessonId es el campo clave que se utiliara para saber cual lesson va a ser el editado
app.put("", authenticateToken, validateLessonUpdate, async (req: Request, res: Response) => {
  try {
    const lesson: Lesson = req.body;
    const { message, result, status, parametersReceived } = await updateLesson(lesson);
    if (status) {
      if (parametersReceived) {
        res.status(404).json({ message, parametersReceived });
      } else {
        res.json(result);
      }
      //parametersReceived ? res.status(404).json({ message, parametersReceived}) : res.json(result)
    } else {
      res.status(500).json({ error: "500. Error al actualizar el registro" });
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

module.exports = app;
