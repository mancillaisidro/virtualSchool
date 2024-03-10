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
exports.getCoursesByUserId = exports.updateEnrollment = exports.createEnrollment = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const createEnrollment = (studentToEnroll) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'INSERT INTO public.student_lesson (user_id, lesson_id, status) VALUES ($1, $2, $3) RETURNING *';
        const values = [studentToEnroll.userId, studentToEnroll.courseId, 1];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        return { result: result.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error trying to register a new user: ", error.detail);
        return { error: error.detail, status: 0 };
    }
});
exports.createEnrollment = createEnrollment;
const updateEnrollment = (studentToEnroll) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.student_lesson SET status = $1 WHERE user_id = $2 AND lesson_id = $3 RETURNING *;';
        const values = [1, studentToEnroll.userId, studentToEnroll.userId];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        return { result: result.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error trying to register a new user: ", error.detail);
        return { error: error.detail, status: 0 };
    }
});
exports.updateEnrollment = updateEnrollment;
const getCoursesByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'SELECT courses.lesson, courses.course, courses."courseId", courses."lessonId" FROM public.courses INNER JOIN public.student_lesson ON courses."courseId" = student_lesson.lesson_id WHERE student_lesson.user_id = $1;';
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "userId not exist", status: 1 };
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
exports.getCoursesByUserId = getCoursesByUserId;
module.exports = { createEnrollment: exports.createEnrollment, updateEnrollment: exports.updateEnrollment, getCoursesByUserId: exports.getCoursesByUserId };
