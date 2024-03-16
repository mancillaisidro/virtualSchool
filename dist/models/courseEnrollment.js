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
exports.getCoursesByUserId = exports.updateStudentCourseEnrollment = exports.createCourseEnrollment = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const createCourseEnrollment = (studentToEnroll) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'INSERT INTO public.student_course (user_id, course_id, status) VALUES ($1, $2, $3) RETURNING *';
        const values = [studentToEnroll.userId, studentToEnroll.courseId, 1]; //1 indicates is enrolled
        const resultQuery = yield pool.query(query, values);
        const query2 = 'SELECT lesson_id FROM public.lesson WHERE course_id = $1;';
        const resultQuery2 = yield pool.query(query2, [studentToEnroll.courseId]);
        for (const element of resultQuery2.rows) {
            const query3 = 'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
            const values = [studentToEnroll.userId, element.lesson_id, 0]; // Zero indicates not viewed
            yield pool.query(query3, values);
        }
        /*const query3 = 'SELECT lesson_id FROM public.lesson WHERE course_id = $1;';
        const resultQuery3  = await pool.query(query3, [studentToEnroll.courseId])
        for (const element of resultQuery3.rows) {
          const query4 =
        'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
        const values = [studentToEnroll.userId, element.lesson_id , 0]; // Zero indicates not viewed
        await pool.query(query4, values);
        }*/
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        yield pool.query('ROLLBACK');
        console.error("Error trying to register a new user: ", error.detail);
        return { error: error.detail, status: 0 };
    }
});
exports.createCourseEnrollment = createCourseEnrollment;
const updateStudentCourseEnrollment = (studentEnrolledUpdate) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.student_course SET status = $1 WHERE user_id = $2 AND course_id = $3 RETURNING *;';
        const values = [studentEnrolledUpdate.status, studentEnrolledUpdate.userId, studentEnrolledUpdate.courseId];
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
exports.updateStudentCourseEnrollment = updateStudentCourseEnrollment;
const getCoursesByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        const query = 'SELECT course.title, course.course_id FROM public.course INNER JOIN public.student_course ON course.course_id = student_course.course_id WHERE student_course.user_id = $1;';
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
module.exports = { createCourseEnrollment: exports.createCourseEnrollment, updateStudentCourseEnrollment: exports.updateStudentCourseEnrollment, getCoursesByUserId: exports.getCoursesByUserId };
