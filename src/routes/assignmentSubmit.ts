import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const upload = require("./../models/uploadFile");
const {
    createAssignmentSubmit, getAllSubmitionsByAssignmentId, gradeAssignment 
} = require("./../models/assignmentSubmitModel");
import { validateAssignmentSubmit, validateId, validateAssignmentGrade } from "../models/validateAssignmentSubmit";
import { isUserAuthTo } from "../models/userModel";
import { AssignmentSubmit, AssigmentGrade } from "../models/validateAssignmentSubmit";
// GET general para obtener todos los submit assigments por examId, 
app.get("/byExamId/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const { result, status } = await getAllSubmitionsByAssignmentId(id);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error in GET /assignmentSubmition" });
  }
});

// Ruta POST to create A NEW examSubmition, se le debe de enviar un objeto como el siguiente:
app.post("", upload.single("file"), validateAssignmentSubmit,  async (req: Request, res: Response) => {
    try {
        if (!req.file) {
          // El archivo no se subió correctamente
          return res
            .status(400)
            .json({ error: "Error saving the document." });
        }
        const assignment: AssignmentSubmit = req.body;
        const { result, status } = await createAssignmentSubmit(assignment);
        if (status) {
          res.json(result);
        } else {
          res.status(500).json({ error: "Error al ejecutar la consulta" });
        }
      } catch (error) {
        console.error("Error al crear un registro:", error);
        res.status(500).json({ error: "Error in POST /assignmentSubmition" });
      }
});

// Route POST to grade an assignmentSubmition
app.post("/grade", authenticateToken, validateAssignmentGrade,  async (req: Request, res: Response) => {
  try {
      const assignment: AssigmentGrade = req.body;
      const { isAllowed } = await isUserAuthTo("gradeAssignment", assignment.teacherId);
    if(isAllowed){
      const { result, status } = await gradeAssignment(assignment);
      if (status) {
        res.json(result);
      } else {
        res.status(500).json({ error: "Error in POST /Assignment method" });
      }
    } else{
      res.json({ result: "You are not allowed to grade Assignment", status: 1 });
    }
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error in POST assignmentSubmition/grade" });
  }
});
module.exports = app;
