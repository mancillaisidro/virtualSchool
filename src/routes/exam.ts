import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const {
    getAllExamsByUserId, 
    createExam, 
    getExamById, 
    updateExamById, 
    deleteExam
} = require("./../models/examModel");
import { Exam } from "../models/examModel";
// GET general para obtener todos los exams, devolverá un arreglo de objetos
app.get("/byCreator/:id", authenticateToken, async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { result, status } = await getAllExamsByUserId(id);
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

// Ruta POST to create A NEW EXAM, se le debe de enviar un objeto como el siguiente:
// {"description":"mi first Exam","dueDate":"2024-03-08 11:59:00","title":"Mi primera chambaaaaa","userId":"1", "lessonId": "300"}
app.post("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const examencito: Exam = req.body
    const { result, status } = await createExam(examencito);
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

// Rute to get an exam by its ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getExamById(id);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para eliminar un examen por su examId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteExam(id);
  if (status) {
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"description":"mi second exam","dueDate":"2024-03-08 11:59:00","title":"Mi segundaa chambaaa","userId":"1","examId":"8"}
// el examId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const examencito: Exam = req.body
    const { message, result, status, parametersReceived } = await updateExamById(
        examencito
    );
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
