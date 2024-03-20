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
const config = require("./routes/dbProductionConfig");
const pg_1 = require("pg");
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
// route to GET ALL Users
app.use("/users", require('./routes/user'));
// definiendo ruta para los courses
app.use("/virtualschool/course", require("./routes/course"));
// definiendo ruta para los lessons
app.use("/virtualschool/lesson", require("./routes/lesson"));
// route for EXAMS
app.use("/exam", require('./routes/exam'));
// route for receive exam submitions
app.use("/examSubmition", require('./routes/examSubmit'));
// route for assignments
app.use("/assignment", require('./routes/assignment'));
// route for assignments submitions
app.use("/assignmentSubmition", require('./routes/assignmentSubmit'));
// route to enroll a Course
app.use('/studentEnrollment', require('./routes/studentEnrollment'));
// definiendo ruta para mandar un token al usuario
// para obtener un token hay que enviar un objeto a esta url del tipo { username: "tuNombre"}
app.use("/login", require("./routes/login"));
// route for receive message 
app.use("/sendMessage", require("./routes/sendMessage"));
app.post("/json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'INSERT INTO public.json_patrick (json_patrick) VALUES ($1) RETURNING json_patrick, id;';
        const values = [JSON.stringify(req.body.jsonPatrick)];
        const result = yield pool.query(query, values);
        return res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error trying to register a new json: ", error);
        return res.status(500).json('something went wrong');
    }
}));
app.get("/json/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'SELECT json_patrick, id FROM public.json_patrick WHERE id = $1;';
        const values = [req.params.id];
        const result = yield pool.query(query, values);
        return res.json(result.rows[0]);
    }
    catch (error) {
        console.error("Error trying to register a new json: ", error);
        return res.status(500).json('something went wrong');
    }
}));
app.put("/json", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'UPDATE public.json_patrick SET json_patrick = $1 WHERE id = $2 returning json_patrick;';
        const values = [JSON.stringify(req.body.jsonPatrick), req.body.jsonId];
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            res.json('Row not found');
        }
        else {
            res.json(result.rows[0]);
        }
    }
    catch (error) {
        console.error("Error trying to update: ", error);
        return res.status(500).json('something went wrong');
    }
}));
// definiendo ruta para subir archivo al servidor
app.use("/virtualschool/uploadLessonFile", require("./routes/uploadFile"));
// definiendo ruta para obtener un archivo de la lesson desde el servidor
app.use("/virtualschool/getLessonFile", require("./routes/sendFile"));
// definiendo ruta para formulario de subir archivo DE PRUEBA SOLAMENTE
app.get("/uploadLessonFile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   //sended ? res.json('Correo Enviado') : res.json('Hubo un error')
    console.log('GET DEL FORMULARIO ALV');
    res.render("uploadFileForm.ejs");
}));
// app.use("/getCourses", express.static(path.join(__dirname, "./uploads")));
app.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hi there, I'm working! :)");
}));
app.listen(port, () => {
    console.log(`Express Server listening on your localhost, port:  ${port}`);
});
