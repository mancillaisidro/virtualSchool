import express, { Request, Response, NextFunction } from "express";
import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");
const upload = require("./../models/uploadFile");
const app = express.Router();
// const {checkIfLessonExist, savePathInDB} = require('./../models/lessons');
async function checkIfLessonExist(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = req.body.lessonId ?? 0;
  if (id === null || id === "" || id === undefined)
    res.status(401).json({ message: "lessonId is null, undefined or empty" });
  try {
    const query = 'SELECT "lessonId" FROM public.courses WHERE "lessonId" = $1';
    const pool = new Pool(config);
    console.log("valor de lessonId que se ejecutara en la consulta",id)
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      res.status(401).json("lessonId not found");
    } else {
      req.body.lessonId = result.rows[0].lessonId;
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
async function savePathInDB(req: Request, res: Response, next: NextFunction) {
  console.log('estamos en savePath')
  try {
    const query =
      'UPDATE public.exam SET file = $1 WHERE exam_id = $2 RETURNING *';
    const values = [req.body.pathToDB, req.body.examId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      res.json("ExamId does not exist in the database.");          
    } else {
      next()
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.json("Database error, go to the terminal to see more info about this error."); 
  }
}
// Ruta para manejar la subida de archivos
app.post(
  "",
  upload.single("file"), /* middleware function to store the file in the server */
  savePathInDB, /* once the file is stored in the server, we save the file name in the database */
  async (req: Request, res: Response) => {
    console.log('estamos en POST method')
    if (!req.file) {
      // El archivo no se subió correctamente
      return res
        .status(400)
        .json({ error: "Please select a file to be uploaded." });
    }
    res.json("File saved succesfully");
  }
);

module.exports = app;
