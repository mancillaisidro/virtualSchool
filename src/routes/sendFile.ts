import express, { NextFunction, Request, Response } from "express";
import path from "path";
const app = express.Router();
const { getFileName } = require("./../models/lessons")
// async function checkIfLessonExist(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const id = req.query.lessonId ?? 4009;
//   if (id === null || id === "" || id === undefined)
//     res.status(401).json({ message: "lessonId is null, undefined or empty" });
//   try {
//     const query =
//       'SELECT "lessonId", "pathFile" FROM public.courses WHERE "lessonId" = $1';
//     const pool = new Pool(config);
//     const result = await pool.query(query, [id]);
//     if (result.rows.length === 0) {
//       res.status(401).json("lessonId not found");
//     } else {
//       req.params.pathFile = result.rows[0].pathFile;
//       next();
//     }
//   } catch (error) {
//     console.error("Error al obtener el registro:", error);
//     res
//       .status(401)
//       .json(
//         "Database connection error, please go to the terminal to see more details."
//       );
//   }
// }
// Ruta para manejar la descarga de archivos, espera como parametros un json object del tipo:
// { "lessonId": 4000 }
app.get(
  "",
  getFileName,
  async (req: Request, res: Response) => {
    try {
      const filePath = 
        `/tmp/${req.params.pathFile}`;
      res.download(filePath);
    } catch (error) {
      console.log(
        "Server error when trying to send the file to the client",
        error
      );
      res
        .status(400)
        .json(
          "Server error, please go to terminal to see more details about this error"
        );
    }
  }
);

module.exports = app;
