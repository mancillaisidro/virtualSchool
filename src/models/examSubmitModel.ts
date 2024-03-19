import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");
import { ExamGrade, ExamSubmit } from './validateExamSubmit'
// method to get all the exams created by an Instructor

const createExamSubmit = async (examSubmit : ExamSubmit) => {
  const pool = new Pool(config);
  try {
    await pool.query('BEGIN');
    const query =
      'INSERT INTO public.exam_submition (exam_id, user_id, url, comment) VALUES ($1, $2, $3, $4) RETURNING submition_id';
    const values = [examSubmit.examId, examSubmit.userId, examSubmit.fileName, examSubmit.comment];
    const resultQuery = await pool.query(query, values);
    const query2 = 'UPDATE public.student_exam SET status = $1';
    await pool.query(query2, [1]);
    await pool.query('COMMIT');
    return { result: resultQuery.rows[0], status: 1 };
  } catch (error) {
    console.error("Error while executing a transaction in createExam function:", error);
    await pool.query('ROLLBACK');
    return { error: "Error al crear un registro en tabla exam", status: 0 };
  }
};
// method to get all the exams created by an Instructor
const getAllSubmitionsByExamId = async (id:number) => {
    const pool = new Pool(config);
    try {
      await pool.query('BEGIN');
      const query = 'SELECT uno.url, uno.comment, dos.status, tres.name FROM public.exam_submition uno INNER JOIN public.student_exam  dos ON uno.exam_id = dos.exam_id INNER JOIN public.user tres ON dos.user_id = tres.id WHERE uno.exam_id = $1 AND dos.exam_id= $1;';
      const resultQuery = await pool.query(query, [id]);
      if (resultQuery.rows.length === 0) {
        return { result: "There are not exam submitions for this exam", status: 1 };
      } else {
        return { result: resultQuery.rows, status: 1 };
      }
    } catch (error) {
      console.error("Error en la consulta:", error);
      return { error: "Error en la consulta", status: 0 };
    }
  };
  
  const gradeExam = async (exam : ExamGrade) => {
    const pool = new Pool(config);
    try {
      await pool.query('BEGIN');
      const query =
        'UPDATE public.exam_submition SET score = $1 WHERE submition_id = $2 RETURNING score, submition_id';
      const values = [exam.score, exam.submitionId];
      const resultQuery = await pool.query(query, values);
      if(resultQuery.rows.length == 0) return { result: 'submition Id does not exist', status: 1 };
      const query2 = 'UPDATE public.student_exam SET status = $1 WHERE exam_id = $2';
      await pool.query(query2, [ 2, exam.teacherId]);
      await pool.query('COMMIT');
      return { result: resultQuery.rows[0], status: 1 };
    } catch (error) {
      console.error("Error while executing a transaction in gradeExam function:", error);
      await pool.query('ROLLBACK');
      return { error: "Error in gradeExam function", status: 0 };
    }
  };

module.exports = { createExamSubmit, getAllSubmitionsByExamId, gradeExam };
