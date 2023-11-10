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
const createLesson = (lessonName, lessonId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'INSERT INTO public.courses (lesson, "lessonId", "courseId") VALUES ($1, $2, $3) RETURNING *';
        const values = [lessonName, lessonId, courseId];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        return { result: result.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error al crear un course:", error);
        return { error: "Error al crear un registro", status: 0 };
    }
});
const getAllLessons = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT lesson, "lessonId", "courseId" FROM public.courses WHERE "lessonId" IS NOT NULL ORDER BY "lessonId"; ';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query);
        return { result: result.rows, status: 1 };
    }
    catch (error) {
        console.error("Error al obtener el registro:", error);
        return { error: "Error al obtener el registro", status: 0 };
    }
});
const getLesson = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT lesson, "lessonId", "courseId" FROM public.courses WHERE "lessonId" = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "Lesson not exist", status: 1 };
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
const updateLesson = (lessonName, lessonId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.courses SET lesson = $1, "lessonId" = $2, "courseId" = $3 WHERE "lessonId" = $2 RETURNING *';
        const values = [lessonName, lessonId, courseId];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        if (result.rows.length === 0) {
            return {
                message: "Registro no encontrado",
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
        const query = 'DELETE FROM public.courses WHERE "lessonId" = $1 RETURNING *';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { message: "Lesson not found", status: 1 };
        }
        else {
            return { message: "Lesson eliminado correctamente", status: 1 };
        }
    }
    catch (error) {
        console.error("Error al eliminar el registro:", error);
        return { error: "Error al eliminar el registro", status: 0 };
    }
});
module.exports = { createLesson, getLesson, getAllLessons, updateLesson, deleteLesson };
