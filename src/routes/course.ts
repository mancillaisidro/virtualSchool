import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Course, validateCourse, validateId } from "../models/validateCourse";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
import { isUserAuthTo } from "../models/userModel";
const { 
  getCourseById,
  getAllCoursesByUserId,
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse
} = require("./../models/courseModel");

// GET to get ALL the courses.
app.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { result, status } = await getAllCourses();
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error executing query" });
    }
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error " });
  }
});

// Ruta POST para crear un nuevo course, se le debe de enviar un objeto como el siguiente:
// POST to create a new course, a object type Couse should be sent in the body
// {"userId":1,"title":"English"}
app.post("", authenticateToken, validateCourse,  async (req: Request, res: Response) => {
  try {
    const course: Course = req.body;
    const { isAllowed } = await isUserAuthTo("createCourse", course.userId);
    if(isAllowed){
      const { result, status } = await createCourse(course);
      if (status) {
        res.json(result);
      } else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
      }
    } else{
      res.json({ result: "You are not allowed to create Courses", status: 1 });
    }
    
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error al crear un registro" });
  }
});

// Ruta para obtener un course por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getCourseById(id);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para obtener un course por el user_id, se le debe de mandar un id(del tipo int) como parametro
app.get("/byCreator/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { result, status } = await getAllCoursesByUserId(id);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  });

// Ruta para eliminar un registro por su courseId, el cual se debe de mandar como parametro (del tipo entero)
app.delete("/:id", authenticateToken, validateId, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteCourse(id);
  if (status) {
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"title": "math" , "course_id": 1009, }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, validateCourse, async (req: Request, res: Response) => {
  try {
    const course: Course = req.body;
    const { message, result, status, parametersReceived } = await updateCourse(
      course
    );
    if (status) {
      if (parametersReceived) {
        res.status(404).json({ message, parametersReceived });
      } else {
        res.json(result);
      }
      //parametersReceived ? res.status(404).json({ message, parametersReceived}) : res.json(result)
    } else {
      res.status(500).json({ error: "500. Error al actualizar el registro" });
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

module.exports = app;
