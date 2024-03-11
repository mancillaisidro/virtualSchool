import express, { Request, Response } from "express";
const app = express.Router();
//import the course validator and model
import { validateStudentCourse, validateStudentCourseUpdate } from "../models/validateCourseEnrollment";
import { createCourseEnrollment, getCoursesByUserId, updateStudentCourseEnrollment } from "../models/courseEnrollment";

// import the lesson validator and model
import { validateStudentLessonEnrolled, validateStudentLessonUpdate } from "../models/validateLessonEnrollment";
import { getLessonsByUserIdAndCourseId, updateStudentLesson } from "../models/lessonEnrollment";

// we define the object types 
import { studentCourse } from "../models/validateCourseEnrollment";
import { studentLessonToUpdate } from "../models/validateLessonEnrollment";

// POST to receive a new course enrollment
app.post("/course", validateStudentCourse,  async (req: Request, res: Response) => {
    try {
        const studentCourseEnrollment: studentCourse = req.body;
        const { result, status, error } = await createCourseEnrollment(studentCourseEnrollment);
        if (status) {
          res.json(result);
        } else {
          res.status(400).json({ error });
        }
      } catch (error) {
        console.error("Error trying to create a user", error);
        res.status(500).json({ error: "Error trying to create a user" });
      }
    
});
// Route to get user info by "id", we need to send the "id" (type integer) as a parameter for the GET request
app.get("/courses/:id",  async (req: Request, res: Response) => {
    const {id} = req.params;
    const numericId = parseInt(id, 10);
    const { result, status } = await getCoursesByUserId(numericId);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error while trying to get the user info" });
    }
  });

  // Route to get all the lesson where the user is enrolled in. By courseId
app.get("/lessons", validateStudentLessonEnrolled,  async (req: Request, res: Response) => {
  const { userId, courseId} = req.query;
  const numericId = parseInt(userId as string); 
  const numericId2 = parseInt(courseId as string);
  const { result, status } = await getLessonsByUserIdAndCourseId(numericId, numericId2);
  if (status) {
    res.json(result);
  } else {
    res.status(500).json({ error: "Error while trying to get the user info" });
  }
});
//PUT to update the course's status in the table student_course
app.put("/course", validateStudentCourseUpdate, async (req: Request, res: Response) => {
  try {
    const studentCourse: studentCourse = req.body;
    const { message, result, status, parametersReceived } = await updateStudentCourseEnrollment(studentCourse);
    if (status) {
      if (parametersReceived) {
        res.status(404).json({ message, parametersReceived });
      } else {
        res.json(result);
      }
    } else {
      res.status(500).json({ error: "500. Error al actualizar el registro" });
    }
  } catch (error) {
    console.error("Error al actualizar el registro:", error);
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
});

//PUT to update the lesson's status in the table student_lesson
app.put("/lesson", validateStudentLessonUpdate, async (req: Request, res: Response) => {
  try {
    const lesson: studentLessonToUpdate = req.body;
    const { message, result, status, parametersReceived } = await updateStudentLesson(lesson);
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
