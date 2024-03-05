import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const {
    getAllAssignmentsByUserId, 
    createAssignment, 
    getAssignmentById, 
    updateAssignmentById, 
    deleteAssignment
} = require("./../models/assignmentModel");
import { Assignment } from "../models/assignmentModel";
import { validateAssignment, validateAssignmenttoUpdate, validateId } from "../models/validateAssignments";
// GET general para obtener todos los assignments, devolverá un arreglo de objetos
app.get("/byCreator/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { result, status } = await getAllAssignmentsByUserId(id);
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
app.post("", authenticateToken, validateAssignment, async (req: Request, res: Response) => {
  try {
    const examencito: Assignment = req.body
    const { result, status } = await createAssignment(examencito);
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
app.get("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getAssignmentById(id);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para eliminar un examen por su examId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteAssignment(id);
  if (status) {
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"description":"mi second exam","dueDate":"2024-03-08 11:59:00","title":"Mi segundaa chambaaa","userId":"1","examId":"8"}
// el examId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, validateAssignmenttoUpdate, async (req: Request, res: Response) => {
  try {
    const examencito: Assignment = req.body
    const { message, result, status, parametersReceived } = await updateAssignmentById(
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
