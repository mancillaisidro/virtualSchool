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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = express_1.default.Router();
const { authenticateToken } = require("./../models/auth");
const { createCourse, getCourse, getAllCourses, deleteCourse, updateCourse, } = require("./../models/courses");
// GET general para obtener todos los courses, devolverá un arreglo de objetos
app.get("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { result, status } = yield getAllCourses();
        if (status) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error al ejecutar la consulta" });
        }
    }
    catch (error) {
        console.error("Error al mostrar los cursos:", error);
        res.status(500).json({ error: "Error al mostrar los cursos" });
    }
}));
// Ruta POST para crear un nuevo course, se le debe de enviar un objeto como el siguiente:
// {"courseId": 1009, "courseName": "math" }
app.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course, courseId } = req.body;
        const { result, status } = yield createCourse(course, courseId);
        if (status) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error al ejecutar la consulta" });
        }
    }
    catch (error) {
        console.error("Error al crear un registro:", error);
        res.status(500).json({ error: "Error al crear un registro" });
    }
}));
// Ruta para obtener un course por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getCourse(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para eliminar un registro por su courseId, el cual se debe de mandar como parametro (del tipo entero)
// NOTA: al borrar un course se eliminaran todas las lessons que pertenecen a este curso.
app.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message, status } = yield deleteCourse(id);
    if (status) {
        res.json(message);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"course": "math" , "courseId": 1009, }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { course, courseId } = req.body;
        const { message, result, status, parametersReceived } = yield updateCourse(course, courseId);
        if (status) {
            parametersReceived ? res.status(404).json({ message, parametersReceived }) : res.json(result);
        }
        else {
            res.status(500).json({ error: "500. Error al actualizar el registro" });
        }
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        res.status(500).json({ error: "Error al actualizar el registro" });
    }
}));
module.exports = app;
