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
        // Get all the lessons related to this Course
        const query2 = 'SELECT lesson_id FROM public.lesson WHERE course_id = $1;';
        const resultQuery2 = yield pool.query(query2, [studentToEnroll.courseId]);
        // for each lesson found, we insert into student_lesson to show this content to the user.
        for (const element of resultQuery2.rows) { //para mostrarle al studen las lecciones que ya has sido creadas previamente
            const query3 = 'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
            const values3 = [studentToEnroll.userId, element.lesson_id, 0]; // Zero indicates not viewed
            yield pool.query(query3, values3);
            // consulta para saber si hay examenes en la lesson
            const query4 = 'SELECT exam_id FROM public.exam WHERE lesson_id = $1;';
            const resultQuery4 = yield pool.query(query4, [element.lesson_id]);
            // por cada examen que veamos, vamos a hacer un insert en student_exam para asignarle el examen al student
            for (const element2 of resultQuery4.rows) {
                const query5 = 'INSERT INTO public.student_exam (exam_id, user_id, status) VALUES ( $1, $2, $3);';
                const values5 = [element2.exam_id, studentToEnroll.userId, 0];
                yield pool.query(query5, values5);
            }
            // consulta para saber si hay assignments en la lesson
            const query6 = 'SELECT assignment_id FROM public.assignment WHERE lesson_id = $1;';
            const resultQuery6 = yield pool.query(query6, [element.lesson_id]);
            // por cada examen que veamos, vamos a hacer un insert en student_exam para asignarle el examen al student
            for (const element2 of resultQuery6.rows) {
                const query7 = 'INSERT INTO public.student_assignment (assignment_id, user_id, status) VALUES ( $1, $2, $3);';
                const values7 = [element2.assignment_id, studentToEnroll.userId, 0];
                yield pool.query(query7, values7);
            }
        }
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        yield pool.query('ROLLBACK');
        console.error("Error trying to register a new user: ", error);
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
