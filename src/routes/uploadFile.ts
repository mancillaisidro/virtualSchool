import express, { Request, Response } from "express";
const { authenticateToken } = require("./../models/auth");
const upload = require("./../models/uploadFile");
const app = express.Router();

// Ruta para manejar la subida de archivos
app.post(
  "/uploadCourse",
  upload.single("file"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      // El archivo no se subió correctamente
      return res
        .status(400)
        .json({ error: "No se proporcionó ningún archivo." });
    }

    // Aquí puedes hacer algo con el archivo subido
    console.log(req.file);
    console.log("Estamos recibiendo la petición");

    res.json("File saved succesfully");
  }
);

module.exports = app;
