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
exports.getUser = exports.createUser = void 0;
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = new pg_1.Pool(config);
        const queryAll = 'SELECT course, "courseId" FROM public.courses WHERE "lessonId" IS NULL; ';
        const result = yield pool.query(queryAll);
        return { result: result.rows, status: 1 };
    }
    catch (error) {
        console.error("Error en la consulta:", error);
        return { error: "Error en la consulta", status: 0 };
    }
});
const createUser = (mail, name, userType, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'INSERT INTO public.user (mail, name, user_type, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [mail, name, userType, password];
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, values);
        return { result: result.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error trying to register a new user: ", error);
        return { error: "Error trying to register a new user", status: 0 };
    }
});
exports.createUser = createUser;
const getUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT * FROM public.user WHERE id = $1';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "User not exist", status: 1 };
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
exports.getUser = getUser;
const updateCourse = (courseName, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.courses SET course = $1, "courseId" = $2 WHERE "courseId" = $2 AND "lessonId" IS NULL RETURNING *';
        const values = [courseName, courseId];
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
const deleteCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'DELETE FROM public.courses WHERE "courseId" = $1 RETURNING *';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { message: "Course not found", status: 1 };
        }
        else {
            return { message: "Course eliminado correctamente", status: 1 };
        }
    }
    catch (error) {
        console.error("Error al eliminar el registro:", error);
        return { error: "Error al eliminar el registro", status: 0 };
    }
});
module.exports = { createUser: exports.createUser, getUser: exports.getUser, getAllCourses, updateCourse, deleteCourse };
