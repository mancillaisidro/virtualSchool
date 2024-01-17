import express, { Response, Request } from "express";
import bodyParser from "body-parser";
import path, { extname, join } from "path";
import multer from "multer";
const nodemailer = require("nodemailer");
import dotenv from "dotenv";
// Carga las variables de entorno desde .env
dotenv.config();
const app = express();
// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json());
// definimos el puerto en el que se estara corriendo la app
const port = 3000;
// Configurando EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// definiendo ruta para los courses
app.use("/virtualschool/courses", require("./routes/courses"));
// definiendo ruta para las lessons
app.use("/virtualschool/lessons", require("./routes/lessons"));

// definiendo ruta para mandar un token al usuario
// para obtener un token hay que enviar un objeto a esta url del tipo { username: "tuNombre"}
app.use("/login", require("./routes/login"));
// definiendo ruta para formulario de subir archivo
app.get("/uploadFile", async (req: Request, res: Response) => {
  //sended ? res.json('Correo Enviado') : res.json('Hubo un error')
  res.render("uploadFileForm.ejs");
});
// definiendo ruta para subir archivo al servidor
app.use("/virtualschool", require("./routes/uploadFile"));

app.listen(port, () => {
  console.log(`Express Server listening on port:  ${port}`);
});
