import { NextFunction, Request, Response } from "express";
const jwt = require("jsonwebtoken");

// Define una interfaz para extender el objeto Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Token is null" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: "Not valid token" });
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
