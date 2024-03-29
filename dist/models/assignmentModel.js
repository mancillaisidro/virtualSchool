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
// method to get all the assignments created by an Instructor
const getAllAssignmentsByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT assignment_id, description, lesson_id, due_date, user_id, title FROM public.assignment WHERE user_id = $1; ';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { result: "Row not exist", status: 1 };
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
const createAssignment = (assignment) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'INSERT INTO public.assignment (description, lesson_id, due_date, user_id, title, file) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
        const values = [assignment.description, assignment.lessonId, assignment.dueDate, assignment.userId, assignment.title, assignment.pathToDB];
        const resultQuery = yield pool.query(query, values);
        const query2 = 'SELECT user_id FROM public.student_lesson WHERE lesson_id = $1';
        const lessonIdValue = [resultQuery.rows[0].lesson_id];
        const resultQuery2 = yield pool.query(query2, lessonIdValue);
        for (const element of resultQuery2.rows) {
            const query3 = 'INSERT INTO public.student_assignment(user_id, assignment_id, status) VALUES ( $1, $2, $3) returning *;';
            const values = [element.user_id, resultQuery.rows[0].assignment_id, 0];
            yield pool.query(query3, values);
        }
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error while executing a transaction in createAssignment function:", error);
        yield pool.query('ROLLBACK');
        return { error: "Error al crear un registro en tabla assignment", status: 0 };
    }
});
const getAssignmentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT assignment_id, description, lesson_id, due_date, user_id, title, file FROM public.assignment WHERE assignment_id = $1';
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
const updateAssignmentById = (assignment) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'UPDATE public.assignment SET  description=$1, due_date=$2, title=$3 WHERE assignment_id = $4 AND user_id=$5 RETURNING *';
        const values = [assignment.description, assignment.dueDate, assignment.title, assignment.assignmentId, assignment.userId];
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
        console.error("Error al actualizar el registro:", error);
        return { error: "Error al actualizar el registro", status: 0 };
    }
});
const deleteAssignment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'DELETE FROM public.assignment WHERE assignment_id = $1 RETURNING *';
        const pool = new pg_1.Pool(config);
        const result = yield pool.query(query, [id]);
        if (result.rows.length === 0) {
            return { message: "Assignment not found", status: 1 };
        }
        else {
            return { message: "Assignment deleted successfully", status: 1 };
        }
    }
    catch (error) {
        console.error("Error al eliminar el registro:", error);
        return { error: "Error al eliminar el registro", status: 0 };
    }
});
module.exports = { getAllAssignmentsByUserId, createAssignment, getAssignmentById, updateAssignmentById, deleteAssignment };
