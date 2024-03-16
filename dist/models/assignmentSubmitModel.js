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
// method to get all the exams created by an Instructor
const createExamSubmit = (examSubmit) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'INSERT INTO public.assignment_submition (assignment_id, user_id, url, comment) VALUES ($1, $2, $3, $4) RETURNING submition_id';
        const values = [examSubmit.assignmentId, examSubmit.userId, examSubmit.fileName, examSubmit.comment];
        const resultQuery = yield pool.query(query, values);
        const query2 = 'UPDATE public.student_assignment SET status = $1';
        yield pool.query(query2, [1]);
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error while executing a transaction in createAssignmentSubmition function:", error);
        yield pool.query('ROLLBACK');
        return { error: "Error al crear un registro en tabla exam", status: 0 };
    }
});
// method to get all the exams created by an Instructor
const getAllSubmitionsByExamId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'SELECT uno.url, uno.comment, dos.status, tres.name FROM public.student_submition uno INNER JOIN public.student_assignment  dos ON uno.exam_id = dos.exam_id INNER JOIN public.user tres ON dos.user_id = tres.id WHERE uno.exam_id = $1 AND dos.exam_id= $1;';
        const resultQuery = yield pool.query(query, [id]);
        if (resultQuery.rows.length === 0) {
            return { result: "There are not exam submitions for this exam", status: 1 };
        }
        else {
            return { result: resultQuery.rows, status: 1 };
        }
    }
    catch (error) {
        console.error("Error en la consulta:", error);
        return { error: "Error en la consulta", status: 0 };
    }
});
module.exports = { createExamSubmit, getAllSubmitionsByExamId };
