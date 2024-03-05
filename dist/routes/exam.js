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
const { getAllExamsByUserId, createExam, getExamById, updateExamById, deleteExam } = require("./../models/examModel");
const validateExam_1 = require("../models/validateExam");
// GET general para obtener todos los exams, devolverá un arreglo de objetos
app.get("/byCreator/:id", authenticateToken, validateExam_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { result, status } = yield getAllExamsByUserId(id);
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
// Ruta POST to create A NEW EXAM, se le debe de enviar un objeto como el siguiente:
// {"description":"mi first Exam","dueDate":"2024-03-08 11:59:00","title":"Mi primera chambaaaaa","userId":"1", "lessonId": "300"}
app.post("", authenticateToken, validateExam_1.validateExam, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const examencito = req.body;
        const { result, status } = yield createExam(examencito);
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
// Rute to get an exam by its ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, validateExam_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getExamById(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para eliminar un examen por su examId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateExam_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message, status } = yield deleteExam(id);
    if (status) {
        res.json(message);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"description":"mi second exam","dueDate":"2024-03-08 11:59:00","title":"Mi segundaa chambaaa","userId":"1","examId":"8"}
// el examId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, validateExam_1.validateExamtoUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const examencito = req.body;
        const { message, result, status, parametersReceived } = yield updateExamById(examencito);
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
