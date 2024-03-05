import { Pool } from "pg";
const config = require("./../routes/dbProductionConfig");

export interface Assignment{
    assignmentId: number,
    title: string,
    lessonId: number,
    description: string,
    dueDate: string,
    userId: number,

}
// method to get all the assignments created by an Instructor
const getAllAssignmentsByUserId = async (id:number) => {
  try {
    const query = 'SELECT assignment_id, description, lesson_id, due_date, user_id, title FROM public.assignment WHERE user_id = $1; ';
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

const createAssignment = async (assignment: Assignment) => {
  try {
    const query =
      'INSERT INTO public.assignment (description, lesson_id, due_date, user_id, title) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [assignment.description, assignment.lessonId, assignment.dueDate, assignment.userId, assignment.title];
    const pool = new Pool(config);
    const result = await pool.query(query, values);
    return { result: result.rows[0], status: 1 };
  } catch (error) {
    console.error("Error al crear un assignment:", error);
    return { error: "Error al crear un registro en tabla assignment", status: 0 };
  }
};

const getAssignmentById = async (id: number) => {
  try {
    const query = 'SELECT assignment_id, description, lesson_id, due_date, user_id, title FROM public.assignment WHERE assignment_id = $1';
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

const updateAssignmentById = async (assignment: Assignment) => {
  try {
    const query =
      'UPDATE public.assignment SET  description=$1, due_date=$2, title=$3 WHERE assignment_id = $4 AND user_id=$5 RETURNING *';
    const values = [assignment.description, assignment.dueDate, assignment.title, assignment.assignmentId, assignment.userId];
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

const deleteAssignment = async (id: number) => {
  try {
    const query =
      'DELETE FROM public.assignment WHERE assignment_id = $1 RETURNING *';
    const pool = new Pool(config);
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { message: "Assignment not found" , status: 1};
    } else {
      return { message: "Assignment deleted successfully", status: 1 };
    }
  } catch (error) {
    console.error("Error al eliminar el registro:", error);
    return { error: "Error al eliminar el registro", status: 0 };
  }
};

module.exports = { getAllAssignmentsByUserId, createAssignment, getAssignmentById, updateAssignmentById, deleteAssignment};
