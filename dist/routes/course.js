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
const validateCourse_1 = require("../models/validateCourse");
dotenv_1.default.config();
const app = express_1.default.Router();
const { authenticateToken } = require("./../models/auth");
const userModel_1 = require("../models/userModel");
const { getCourseById, getAllCoursesByUserId, createCourse, getAllCourses, deleteCourse, updateCourse } = require("./../models/courseModel");
// GET to get ALL the courses.
app.get("/", authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { result, status } = yield getAllCourses();
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
// Ruta POST para crear un nuevo course, se le debe de enviar un objeto como el siguiente:
// POST to create a new course, a object type Couse should be sent in the body
// {"userId":1,"title":"English"}
app.post("", authenticateToken, validateCourse_1.validateCourse, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = req.body;
        const { isAllowed } = yield (0, userModel_1.isUserAuthTo)("createCourse", course.userId);
        if (isAllowed) {
            const { result, status } = yield createCourse(course);
            if (status) {
                res.json(result);
            }
            else {
                res.status(500).json({ error: "Error al ejecutar la consulta" });
            }
        }
        else {
            res.json({ result: "You are not allowed to create Courses", status: 1 });
        }
    }
    catch (error) {
        console.error("Error al crear un registro:", error);
        res.status(500).json({ error: "Error al crear un registro" });
    }
}));
// Ruta para obtener un course por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, validateCourse_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getCourseById(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para obtener un course por el user_id, se le debe de mandar un id(del tipo int) como parametro
app.get("/byCreator/:id", authenticateToken, validateCourse_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getAllCoursesByUserId(id);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Ruta para eliminar un registro por su courseId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateCourse_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
// {"title": "math" , "course_id": 1009, }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, validateCourse_1.validateCourse, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const course = req.body;
        const { message, result, status, parametersReceived } = yield updateCourse(course);
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
