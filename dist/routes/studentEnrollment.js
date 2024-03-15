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
const app = express_1.default.Router();
//import the course validator and model
const validateCourseEnrollment_1 = require("../models/validateCourseEnrollment");
const courseEnrollment_1 = require("../models/courseEnrollment");
// import the lesson validator and model
const validateLessonEnrollment_1 = require("../models/validateLessonEnrollment");
const lessonEnrollment_1 = require("../models/lessonEnrollment");
// POST to receive a new course enrollment
app.post("/course", validateCourseEnrollment_1.validateStudentCourse, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentCourseEnrollment = req.body;
        const { result, status, error } = yield (0, courseEnrollment_1.createCourseEnrollment)(studentCourseEnrollment);
        if (status) {
            res.json(result);
        }
        else {
            res.status(400).json({ error });
        }
    }
    catch (error) {
        console.error("Error trying to create a user", error);
        res.status(500).json({ error: "Error trying to create a user" });
    }
}));
// Route to get the courses that the user is enrolled in, we need to send the "id" (type integer) as a parameter for the GET request
app.get("/courses/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const { result, status } = yield (0, courseEnrollment_1.getCoursesByUserId)(numericId);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error while trying to get the user info" });
    }
}));
// Route to get all the lesson where the user is enrolled in. By courseId
app.get("/lessons", validateLessonEnrollment_1.validateStudentLessonEnrolled, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, courseId } = req.query;
    const numericId = parseInt(userId);
    const numericId2 = parseInt(courseId);
    const { result, status } = yield (0, lessonEnrollment_1.getLessonsByUserIdAndCourseId)(numericId, numericId2);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error while trying to get the user info" });
    }
}));
//PUT to update the course's status in the table student_course
app.put("/course", validateCourseEnrollment_1.validateStudentCourseUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentCourse = req.body;
        const { message, result, status, parametersReceived } = yield (0, courseEnrollment_1.updateStudentCourseEnrollment)(studentCourse);
        if (status) {
            if (parametersReceived) {
                res.status(404).json({ message, parametersReceived });
            }
            else {
                res.json(result);
            }
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
//PUT to update the lesson's status in the table student_lesson
app.put("/lesson", validateLessonEnrollment_1.validateStudentLessonUpdate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lesson = req.body;
        const { message, result, status, parametersReceived } = yield (0, lessonEnrollment_1.updateStudentLesson)(lesson);
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
