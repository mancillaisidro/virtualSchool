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
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const getAllLessonsByCourseId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = new pg_1.Pool(config);
        const query = 'SELECT title, lesson_id, link FROM public.lesson WHERE course_id = $1; ';
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "There are not lesssons for this course", status: 1 };
        }
        else {
            return { result: result.rows, status: 1 };
        }
    }
    catch (error) {
        console.error("Error en la consulta:", error);
        return { error: "Error en la consulta", status: 0 };
    }
});
const getAllLessonsByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = new pg_1.Pool(config);
        const query = 'SELECT title, lesson_id, course_id, link FROM public.lesson WHERE user_id = $1; ';
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "There are no lessons created by this user", status: 1 };
        }
        else {
            return { result: result.rows, status: 1 };
        }
    }
    catch (error) {
        console.error("Error en la consulta:", error);
        return { error: "Error in query", status: 0 };
    }
});
const createLesson = (lesson) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'INSERT INTO public.lesson (title, user_id, course_id, link) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [lesson.title, lesson.userId, lesson.courseId, lesson.link];
        const resultQuery = yield pool.query(query, values);
        const query2 = 'SELECT user_id FROM public.student_course WHERE course_id = $1';
        const resultQuery2 = yield pool.query(query2, [lesson.courseId]);
        for (const element of resultQuery2.rows) {
            const query3 = 'INSERT INTO public.student_lesson(user_id, lesson_id, status) VALUES ( $1, $2, $3) returning *;';
            const values = [element.user_id, resultQuery.rows[0].lesson_id, 0]; // Zero indicates not viewed
            yield pool.query(query3, values);
        }
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        yield pool.query('ROLLBACK');
        console.error("Error al crear un lesson:", error);
        return { error: "Error al crear un registro", status: 0 };
    }
});
const getLessonById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT title, user_id, link FROM public.lesson WHERE lesson_id = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "Row not exist", status: 1 };
        }
        else {
            return { result: result.rows[0], status: 1 };
        }
    }
    catch (error) {
        console.error("Error al obtener el registro:", error);
        return { error: "Error al obtener el registro", status: 0 };
    }
});
const updateLesson = (lesson) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.lesson SET title = $1, link = $2 WHERE lesson_id = $3 RETURNING title, link;';
        const values = [lesson.title, lesson.link, lesson.lessonId];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                message: "Lesson not found",
                parametersReceived: values,
                status: 1
            };
        }
        else {
            return { result: result.rows[0], status: 1 };
        }
    }
    catch (error) {
        console.error("Error al actualizar el registro:", error);
        return { error: "Error al actualizar el registro", status: 0 };
    }
});
const deleteLesson = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'DELETE FROM public.lesson WHERE lesson_id = $1 RETURNING *';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { message: "Lesson not found.", status: 1 };
        }
        else {
            return { message: "Lesson deleted successfully.", status: 1 };
        }
    }
    catch (error) {
        console.error("Error al eliminar el registro (lesson):", error);
        return { error: "Error trying to remove a row", status: 0 };
    }
});
module.exports = { getLessonById, getAllLessonsByUserId, getAllLessonsByCourseId, createLesson, updateLesson, deleteLesson };
