import express, { Request, Response } from "express";
import bodyParser from "body-parser";

const app = express();
// Configurar body-parser para analizar las solicitudes JSON
app.use(bodyParser.json());
const port = 3000;

// definiendo ruta para los courses
app.use("/virtualschool/courses", require("./../routes/courses"));

app.listen(port, () => {
  console.log(`Express Server listening on port:  ${port}`);
});
