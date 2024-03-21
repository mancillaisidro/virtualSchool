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
        const query = 'INSERT INTO public.exam_submition (exam_id, user_id, file, comment) VALUES ($1, $2, $3, $4) RETURNING submition_id';
        const values = [examSubmit.examId, examSubmit.userId, examSubmit.pathToDB, examSubmit.comment];
        const resultQuery = yield pool.query(query, values);
        const query2 = 'UPDATE public.student_exam SET status = $1';
        yield pool.query(query2, [1]);
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error while executing a transaction in createExam function:", error);
        yield pool.query('ROLLBACK');
        return { error: "Error al crear un registro en tabla exam", status: 0 };
    }
});
// method to get all the exams created by an Instructor
const getAllSubmitionsByExamId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'SELECT uno.submition_id, uno.file, uno.comment, uno.score, dos.status, tres.name FROM public.exam_submition uno INNER JOIN public.student_exam  dos ON uno.exam_id = dos.exam_id INNER JOIN public.user tres ON dos.user_id = tres.id WHERE uno.exam_id = $1 AND dos.exam_id= $1;';
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
// method to get a single Exam submition by its ID
const getExamSubmition = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = 'SELECT exam_id, user_id, file, score FROM public.exam_submition WHERE submition_id = $1';
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
const gradeExam = (exam) => __awaiter(void 0, void 0, void 0, function* () {
    const pool = new pg_1.Pool(config);
    try {
        yield pool.query('BEGIN');
        const query = 'UPDATE public.exam_submition SET score = $1 WHERE submition_id = $2 RETURNING score, submition_id';
        const values = [exam.score, exam.submitionId];
        const resultQuery = yield pool.query(query, values);
        if (resultQuery.rows.length == 0)
            return { result: 'submition Id does not exist', status: 1 };
        const query2 = 'UPDATE public.student_exam SET status = $1 WHERE exam_id = $2';
        yield pool.query(query2, [2, exam.teacherId]);
        yield pool.query('COMMIT');
        return { result: resultQuery.rows[0], status: 1 };
    }
    catch (error) {
        console.error("Error while executing a transaction in gradeExam function:", error);
        yield pool.query('ROLLBACK');
        return { error: "Error in gradeExam function", status: 0 };
    }
});
module.exports = { createExamSubmit, getAllSubmitionsByExamId, gradeExam, getExamSubmition };
