import express, { Request, Response } from "express";
const app = express.Router();
const jwt = require("jsonwebtoken");
import { validateLogin } from "../models/validateUser";
import { getUserAuth } from "../models/registerUser";
// definimos el tipo de objeto usuario
interface UserLogin{
  email: string,
  password: string,
  userType: number
}
// POST para mandar un token al usuario
/*app.post("", async (req: Request, res: Response) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});*/
app.post("", validateLogin, async (req: Request<{}, {}, UserLogin>, res: Response) => {
  try {
    const user: UserLogin = req.body;
    const { result, status } = await getUserAuth(user);
    if (status) {
      // await createCourseMail("Isidro Servin", course, courseId);
      const user = { email: result.mail };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
      res.json({ id: result.id, email: result.mail, userType: result.user_type, name: result.name, accessToken});
    } else {
      res.status(500).json({ error: "Error executing the query" });
    }
  } catch (error) {
    console.error("Error trying to find a user", error);
    res.status(500).json({ error: "Error trying to find a user" });
  }
})
module.exports = app;
