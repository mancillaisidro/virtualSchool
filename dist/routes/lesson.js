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
const validateLesson_1 = require("../models/validateLesson");
dotenv_1.default.config();
const app = express_1.default.Router();
const { authenticateToken } = require("./../models/auth");
const { getLessonById, getAllLessonsByUserId, createLesson, getAllLessonsByCourseId, deleteLesson, updateLesson } = require("./../models/lessonModel");
// GET to get ALL the Lessons.
app.get("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { result, status } = yield getAllLessonsByCourseId();
        if (status) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error executing query" });
        }
    }
    catch (error) {
        console.error("Error al mostrar los cursos:", error);
        res.status(500).json({ error: "Error " });
    }
}));
// Ruta POST para crear un nuevo lesson, se le debe de enviar un objeto como el siguiente:
// POST to create a new lesson, a object type Couse should be sent in the body
// {"userId":1,"title":"English"}
app.post("", authenticateToken, validateLesson_1.validateLesson, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = req.body;
        const { result, status } = yield createLesson(lesson);
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
// Ruta para obtener un lesson por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, validateLesson_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getLessonById(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para obtener un lesson por el user_id, se le debe de mandar un id(del tipo int) como parametro
app.get("/byCreator/:id", authenticateToken, validateLesson_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getAllLessonsByUserId(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para eliminar un registro por su lessonId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateLesson_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message, status } = yield deleteLesson(id);
    if (status) {
        res.json(message);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"title": "math", "link": "http://google.com/" , "lesson_id": 1009, }
// el lessonId es el campo clave que se utiliara para saber cual lesson va a ser el editado
app.put("", authenticateToken, validateLesson_1.validateLessonUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = req.body;
        const { message, result, status, parametersReceived } = yield updateLesson(lesson);
        if (status) {
            if (parametersReceived) {
                res.status(404).json({ message, parametersReceived });
            }
            else {
                res.json(result);
            }
            //parametersReceived ? res.status(404).json({ message, parametersReceived}) : res.json(result)
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
