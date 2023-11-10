import express, { Response } from "express";
import bodyParser from "body-parser";

const app = express();
// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json());
// definimos el puerto en el que se estara corriendo la app
const port = 3000;

// definiendo ruta para los courses
app.use("/virtualschool/courses", require("./routes/courses"));
// definiendo ruta para las lessons
app.use("/virtualschool/lessons", require("./routes/lessons"));
// definiendo ruta para mandar un token al usuario
// para obtener un token hay que enviar un objeto a esta url del tipo { username: "tuNombre"}
app.use("/login", require("./routes/login"));
// definiendo ruta de inicio  
app.get("", (res: Response) => {
  res.json("Server Running");
});

app.listen(port, () => {
  console.log(`Express Server listening on port:  ${port}`);
});
