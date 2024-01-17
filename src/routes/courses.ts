import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express.Router();
const { authenticateToken } = require("./../models/auth");
const {
  createCourse,
  getCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
} = require("./../models/courses");
const {
  createCourseMail,
  deleteCourseMail,
  updateCourseMail,
} = require("./../models/sendCoursesMail");

// GET general para obtener todos los courses, devolverá un arreglo de objetos
app.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { result, status } = await getAllCourses();
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } catch (error) {
    console.error("Error al mostrar los cursos:", error);
    res.status(500).json({ error: "Error al mostrar los cursos" });
  }
});

// Ruta POST para crear un nuevo course, se le debe de enviar un objeto como el siguiente:
// {"courseId": 1009, "courseName": "math" }
app.post("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { course, courseId } = req.body;
    const { result, status } = await createCourse(course, courseId);
    if (status) {
      await createCourseMail("Isidro Servin", course, courseId);
      res.json(result);
    } else {
      res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
  } catch (error) {
    console.error("Error al crear un registro:", error);
    res.status(500).json({ error: "Error al crear un registro" });
  }
});

// Ruta para obtener un course por su ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { result, status } = await getCourse(id);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para eliminar un registro por su courseId, el cual se debe de mandar como parametro (del tipo entero)
// NOTA: al borrar un course se eliminaran todas las lessons que pertenecen a este curso.
app.delete("/:id", authenticateToken, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message, status } = await deleteCourse(id);
  if (status) {
    await deleteCourseMail("Isidro Servin", id);
    res.json(message);
  } else {
    res.status(500).json({ error: "Error al ejecutar la consulta" });
  }
});

// Ruta para editar un registro, se debe de mandar un objeto del tipo:
// {"course": "math" , "courseId": 1009, }
// el courseId es el campo clave que se utiliara para saber cual course va a ser el editado
app.put("", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { course, courseId } = req.body;
    const { message, result, status, parametersReceived } = await updateCourse(
      course,
      courseId
    );
    if (status) {
      if (parametersReceived) {
        res.status(404).json({ message, parametersReceived });
      } else {
        updateCourseMail("Isidro Servin", result);
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
