import express, { Request, Response } from "express";
const app = express.Router();
import { validateStudentCourse } from "../models/validateStudentEnrollment";
import { createEnrollment, getCoursesByUserId } from "../models/Enrollment";
// we define the object type 
import { studentCourse } from "../models/validateStudentEnrollment";
// POST to receive a new user
app.post("", validateStudentCourse,  async (req: Request, res: Response) => {
    try {
        const studentEnroll: studentCourse = req.body;
        const { result, status, error } = await createEnrollment(studentEnroll);
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
app.get("/:id",  async (req: Request, res: Response) => {
    const {id} = req.params;
    const numericId = parseInt(id, 10);
    const { result, status } = await getCoursesByUserId(numericId);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error while trying to get the user info" });
    }
  });

module.exports = app;
