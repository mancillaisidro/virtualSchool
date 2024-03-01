import express, { Request, Response } from "express";
const app = express.Router();

// POST para recibir peticion de formulario de contacto
app.post("", async (req: Request, res: Response) => {
    const fecha = new Date();
    console.log('POST a /sendMessage at: '+ fecha.getHours() +':'+ fecha.getMinutes());
    console.log(req.body);
  res.status(200).json("success")
});

module.exports = app;