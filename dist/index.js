"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
// Configurar body-parser para analizar las solicitudes JSON
app.use(body_parser_1.default.json());
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
app.get("", (req, res) => {
    res.json("Server Running");
});
app.listen(port, () => {
    console.log(`Express Server listening on port:  ${port}`);
});
