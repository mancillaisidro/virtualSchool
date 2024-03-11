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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLessonsByUserIdAndCourseId = exports.updateStudentLesson = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const updateStudentLesson = (studentEnrolledUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.student_lesson SET status = $1 WHERE user_id = $2 AND lesson_id = $3 RETURNING *;';
        const values = [studentEnrolledUpdate.status, studentEnrolledUpdate.userId, studentEnrolledUpdate.lessonId];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                message: "Row not found",
                parametersReceived: values,
                status: 1
            };
        }
        else {
            return { result: result.rows[0], status: 1 };
        }
    }
    catch (error) {
        console.error("Error trying to register a new user: ", error.detail);
        return { error: error.detail, status: 0 };
    }
});
exports.updateStudentLesson = updateStudentLesson;
const getLessonsByUserIdAndCourseId = (userId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'SELECT lesson.title, lesson.lesson_id, lesson.link, student_lesson.status FROM public.lesson INNER JOIN public.student_lesson ON lesson.lesson_id = student_lesson.lesson_id WHERE student_lesson.user_id = $1 AND lesson.course_id = $2;';
        const result = yield pool.query(query, [userId, courseId]);
        if (result.rows.length === 0) {
            return { result: "There are any Lesson linked to this user and course", status: 1 };
        }
        else {
            return { result: result.rows, status: 1 };
        }
    }
    catch (error) {
        console.error("Error al obtener el registro:", error);
        return { error: "Error al obtener el registro", status: 0 };
    }
});
exports.getLessonsByUserIdAndCourseId = getLessonsByUserIdAndCourseId;
module.exports = { updateStudentLesson: exports.updateStudentLesson, getLessonsByUserIdAndCourseId: exports.getLessonsByUserIdAndCourseId };
