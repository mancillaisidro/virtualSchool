import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const {
    createExamSubmit,
    getAllSubmitionsByExamId,
    gradeExam 
} = require("./../models/examSubmitModel");
import { validateExamSubmit, validateId, ExamSubmit, ExamGrade, validateExamGrade } from "../models/validateExamSubmit";
import { isUserAuthTo } from "../models/userModel";
// GET general para obtener todos los submit assigments por examId, 
app.get("/byExamId/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { result, status } = await getAllSubmitionsByExamId(id);
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

// Ruta POST to create A NEW examSubmition, se le debe de enviar un objeto como el siguiente:
app.post("", authenticateToken, validateExamSubmit,  async (req: Request, res: Response) => {
  try {
    const examencito: ExamSubmit = req.body;
    const { result, status } = await createExamSubmit(examencito);
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

// Route POST to grade an examSubmition
app.post("/grade", authenticateToken, validateExamGrade,  async (req: Request, res: Response) => {
  try {
      const examencito: ExamGrade = req.body;
      const { isAllowed } = await isUserAuthTo("gradeExam", examencito.teacherId);
    if(isAllowed){
      const { result, status } = await gradeExam(examencito);
      if (status) {
        res.json(result);
      } else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
      }
    } else{
      res.json({ result: "You are not allowed to grade Exam", status: 1 });
    }
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error in POST /grade" });
  }
});
module.exports = app;
