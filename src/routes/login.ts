import express, { Request, Response } from "express";
const app = express.Router();
const jwt = require("jsonwebtoken");

// POST para mandar un token al usuario
app.post("", async (req: Request, res: Response) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

module.exports = app;
