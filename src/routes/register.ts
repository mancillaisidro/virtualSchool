import express, { Request, Response } from "express";
const app = express.Router();
import {validateUser, validateId} from "./../models/validateUser"
import {createUser, getUserById } from "./../models/registerUser"
// we define the object type User
interface User{
    mail: string,
    name: string,
    password: string,
    userType: string
  }
  
// POST to receive a new user
app.post("", validateUser,  async (req: Request, res: Response) => {
    try {
        const { email, name, userType, password } = req.body;
        const { result, status } = await createUser(email, name, userType, password);
        if (status) {
          // await createCourseMail("Isidro Servin", course, courseId);
          res.json(result);
        } else {
          res.status(500).json({ error: "Error executing the query" });
        }
      } catch (error) {
        console.error("Error trying to create a user", error);
        res.status(500).json({ error: "Error trying to create a user" });
      }
    
});

// Route to get user info by "id", we need to send the "id" (type integer) as a parameter for the GET request
app.get("/:id", validateId,  async (req: Request, res: Response) => {
    const {id} = req.params;
    const numericId = parseInt(id, 10);
    const { result, status } = await getUserById(numericId);
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error while trying to get the user info" });
    }
  });

module.exports = app;
