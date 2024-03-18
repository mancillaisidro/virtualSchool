import express, { Request, Response } from "express";
const app = express.Router();
import {getAllUsers} from './../models/userModel'

app.get("",  async (req: Request, res: Response) => {
    const { result, status } = await getAllUsers();
    if (status) {
      res.json(result);
    } else {
      res.status(500).json({ error: "Error while trying to get the user info" });
    }
  });

  module.exports = app