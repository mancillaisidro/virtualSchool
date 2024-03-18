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
const validateUser_1 = require("./../models/validateUser");
const registerUser_1 = require("./../models/registerUser");
const userModel_1 = require("../models/userModel");
// POST to receive a new user
app.post("", validateUser_1.validateUser, userModel_1.emailExist, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, userType, password } = req.body;
        const { result, status } = yield (0, registerUser_1.createUser)(email, name, userType, password);
        if (status) {
            // await createCourseMail("Isidro Servin", course, courseId);
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error executing the query" });
        }
    }
    catch (error) {
        console.error("Error trying to create a user", error);
        res.status(500).json({ error: "Error trying to create a user" });
    }
}));
// Route to get user info by "id", we need to send the "id" (type integer) as a parameter for the GET request
app.get("/:id", validateUser_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const numericId = parseInt(id, 10);
    const { result, status } = yield (0, registerUser_1.getUserById)(numericId);
    if (status) {
        res.json(result);
    }
    else {
        res.status(500).json({ error: "Error while trying to get the user info" });
    }
}));
module.exports = app;
