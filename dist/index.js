"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
// Carga las variables de entorno desde .env
dotenv_1.default.config();
const app = (0, express_1.default)();
// Habilitamos CORS
app.use(cors());
// Configurar body-parser para analizar las solicitudes JSON
app.use(express_1.default.json({ limit: "100mb" })); //al parecer erste siempre se necesita
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
// definimos el puerto en el que se estara corriendo la app
const port = 3000;
// Configurando EJS como motor de vistas
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
// definiendo ruta para los courses
// app.use("/virtualschool/courses", require("./routes/courses"));
// definiendo ruta para las lessons
// app.use("/virtualschool/lessons", require("./routes/lessons"));
// route for REGISTER new Users
app.use("/register", require('./routes/register'));
// definiendo ruta para los courses
app.use("/virtualschool/course", require("./routes/course"));
// definiendo ruta para los lessons
app.use("/virtualschool/lesson", require("./routes/lesson"));
// route for EXAMS
app.use("/exam", require('./routes/exam'));
// route for assignments
app.use("/assignment", require('./routes/assignment'));
// route to enroll a Course
app.use('/studentEnrollment', require('./routes/studentEnrollment'));
// definiendo ruta para mandar un token al usuario
// para obtener un token hay que enviar un objeto a esta url del tipo { username: "tuNombre"}
app.use("/login", require("./routes/login"));
// route for receive message 
app.use("/sendMessage", require("./routes/sendMessage"));
// definiendo ruta para subir archivo al servidor
// app.use("/virtualschool/uploadLessonFile", require("./routes/uploadFile"));
// definiendo ruta para obtener un archivo de la lesson desde el servidor
// app.use("/virtualschool/getLessonFile", require("./routes/sendFile"));
// definiendo ruta para formulario de subir archivo DE PRUEBA SOLAMENTE
// app.get("/uploadLessonFile", async (req: Request, res: Response) => {
//   //sended ? res.json('Correo Enviado') : res.json('Hubo un error')
//   res.render("uploadFileForm.ejs");
// });
// app.use("/getCourses", express.static(path.join(__dirname, "./uploads")));
app.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hola");
}));
app.listen(port, () => {
    console.log(`Express Server listening on your localhost, port:  ${port}`);
});
