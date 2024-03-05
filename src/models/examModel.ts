import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

export interface Exam{
    examId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,
}
// method to get all the exams created by an Instructor
const getAllExamsByUserId = async (id:number) => {
  try {
    const query = 'SELECT exam_id, description, lesson_id, due_date, user_id, title FROM public.exam WHERE user_id = $1; ';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
        return { result: "Row not exist", status: 1 };
      } else {
        return { result: result.rows, status: 1 };
      }
  } catch (error) {
    console.error("Error en la consulta:", error);
    return { error: "Error en la consulta", status: 0 };
  }
};

const createExam = async (exam: Exam) => {
  try {
    const query =
      'INSERT INTO public.exam (description, lesson_id, due_date, user_id, title) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [exam.description, exam.lessonId, exam.dueDate, exam.userId, exam.title];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error al crear un exam:", error);
    return { error: "Error al crear un registro en tabla exam", status: 0 };
  }
};

const getExamById = async (id: number) => {
  try {
    const query = 'SELECT exam_id, description, lesson_id, due_date, user_id, title FROM public.exam WHERE exam_id = $1';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) {
      return { result: "Row not exist", status: 1 };
    } else {
      return { result: result.rows[0], status: 1 };
    }
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    return { error: "Error al obtener el registro", status: 0 };
  }
};

const updateExamById = async (exam: Exam) => {
  try {
    const query =
      'UPDATE public.exam SET  description=$1, due_date=$2, title=$3 WHERE exam_id = $4 AND user_id=$5 RETURNING *';
    const values = [exam.description, exam.dueDate, exam.title, exam.examId, exam.userId];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      return {
        message: "Row not found",
        parametersReceived: values,
        status: 1
      };
    } else {
      return {result: result.rows[0], status: 1};
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    return { error: "Error al actualizar el registro", status: 0 };
  }
};

const deleteExam = async (id: number) => {
  try {
    const query =
      'DELETE FROM public.exam WHERE exam_id = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Exam not found" , status: 1};
    } else {
      return { message: "Exam deleted successfully", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return { error: "Error al eliminar el registro", status: 0 };
  }
};

module.exports = { getAllExamsByUserId, createExam, getExamById, updateExamById, deleteExam};
