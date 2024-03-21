import express, { Request, Response } from "express";
import dotenv from "dotenv";
import fs from 'fs';
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const upload = require("./../models/uploadFile");
const {
    createExamSubmit,
    getAllSubmitionsByExamId,
    gradeExam,
    getExamSubmition,
} = require("./../models/examSubmitModel");
import { validateExamSubmit, validateId, ExamSubmit, ExamGrade, validateExamGrade } from "../models/validateExamSubmit";
import { isUserAuthTo } from "../models/userModel";
// GET general para obtener TODOS los submit assigments por examId, 
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

// Rute to get an exam by its ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", validateId,  async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getExamSubmition(id);
  if (status) {
    const filePath = `/tmp/${result.file}`;
    fs.readFile(filePath, (err, data)=>{
      if(err){
        console.log('error reading the file'); 
        return res.status(500).json({error:'Error reading the file'})
      } 
      const base64File = data.toString('base64');
      res.json({...result, file: base64File});
    })
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta POST to create A NEW examSubmition, se le debe de enviar un objeto como el siguiente:
app.post("", upload.single("file"), validateExamSubmit,  async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      // El archivo no se subió correctamente
      return res
        .status(400)
        .json({ error: "Error saving the document." });
    }
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
