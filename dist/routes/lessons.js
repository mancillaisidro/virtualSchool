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
const { createLesson, getLesson, getAllLessons, deleteLesson, updateLesson, } = require("./../models/lessons");
// Ruta POST para crear un nuevo lesson, se le debe de enviar un objeto como el siguiente:
// {"lesson": "calculus", "lessonId": 1009, "courseId": 100}
app.post("", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson, lessonId, courseId } = req.body;
        const { result, status } = yield createLesson(lesson, lessonId, courseId);
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
// GET general para obtener todos los lessons, devolverá un arreglo de objetos
app.get("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { result, status } = yield getAllLessons();
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
// Ruta para obtener un lesson por su ID, se le debe de mandar un id (del tipo int) como parametro
app.get("/:id", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { result, status } = yield getLesson(id);
        status ? res.json(result) : res.status(500).json("Error al consultar");
    }
    catch (error) {
        console.error("Error al mostrar los cursos:", error);
        res.status(500).json({ error: "Error al mostrar los cursos" });
    }
}));
// Ruta para editar un lesson, se debe de mandar un objeto del tipo:
// {"lesson": "math" , "lessonId": 1009 }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lesson, lessonId, courseId } = req.body;
        console.log(req.body);
        const { message, result, status, parametersReceived } = yield updateLesson(lesson, lessonId, courseId);
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
// Ruta para eliminar un registro por su lessonId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message, status } = yield deleteLesson(id);
    if (status) {
        res.json(message);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
module.exports = app;
