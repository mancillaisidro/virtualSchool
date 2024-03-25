"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default.Router();
const jwt = require("jsonwebtoken");
const validateUser_1 = require("../models/validateUser");
const registerUser_1 = require("../models/registerUser");
// POST para mandar un token al usuario
/*app.post("", async (req: Request, res: Response) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});*/
app.post("", validateUser_1.validateLogin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const { result, status } = yield (0, registerUser_1.getUserAuth)(user);
        if (status) {
            // await createCourseMail("Isidro Servin", course, courseId);
            const user = { email: result.mail };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.json({ id: result.id, email: result.mail, userType: result.user_type, name: result.name, accessToken });
        }
        else {
            res.status(500).json({ error: "Error executing the query" });
        }
    }
    catch (error) {
        console.error("Error trying to find a user", error);
        res.status(500).json({ error: "Error trying to find a user" });
    }
}));
module.exports = app;
