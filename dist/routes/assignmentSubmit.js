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
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = express_1.default.Router();
const { authenticateToken } = require("./../models/auth");
const upload = require("./../models/uploadFile");
const { createAssignmentSubmit, getAllSubmitionsByAssignmentId, gradeAssignment, getAssignmentSubmition } = require("./../models/assignmentSubmitModel");
const validateAssignmentSubmit_1 = require("../models/validateAssignmentSubmit");
const userModel_1 = require("../models/userModel");
// GET general para obtener todos los submit assigments por examId, 
app.get("/byExamId/:id", authenticateToken, validateAssignmentSubmit_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { result, status } = yield getAllSubmitionsByAssignmentId(id);
        if (status) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error al ejecutar la consulta" });
        }
    }
    catch (error) {
        console.error("Error al mostrar los cursos:", error);
        res.status(500).json({ error: "Error in GET /assignmentSubmition" });
    }
}));
// Ruta POST to create A NEW examSubmition, se le debe de enviar un objeto como el siguiente:
app.post("", upload.single("file"), validateAssignmentSubmit_1.validateAssignmentSubmit, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            // El archivo no se subió correctamente
            return res
                .status(400)
                .json({ error: "Error saving the document." });
        }
        const assignment = req.body;
        const { result, status } = yield createAssignmentSubmit(assignment);
        if (status) {
            res.json(result);
        }
        else {
            res.status(500).json({ error: "Error al ejecutar la consulta" });
        }
    }
    catch (error) {
        console.error("Error al crear un registro:", error);
        res.status(500).json({ error: "Error in POST /assignmentSubmition" });
    }
}));
// Rute to get an exam by its ID, se le debe de mandar un id(del tipo int) como parametro
app.get("/:id", validateAssignmentSubmit_1.validateId, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { result, status } = yield getAssignmentSubmition(id);
    if (status) {
        const filePath = `/tmp/${result.file}`;
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                console.log('error reading the file');
                return res.status(500).json({ error: 'Error reading the file' });
            }
            const base64File = data.toString('base64');
            res.json(Object.assign(Object.assign({}, result), { file: base64File }));
        });
    }
    else {
        res.status(500).json({ error: "Error al ejecutar la consulta" });
    }
}));
// Route POST to grade an assignmentSubmition
app.post("/grade", authenticateToken, validateAssignmentSubmit_1.validateAssignmentGrade, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const assignment = req.body;
        const { isAllowed } = yield (0, userModel_1.isUserAuthTo)("gradeAssignment", assignment.teacherId);
        if (isAllowed) {
            const { result, status } = yield gradeAssignment(assignment);
            if (status) {
                res.json(result);
            }
            else {
                res.status(500).json({ error: "Error in POST /Assignment method" });
            }
        }
        else {
            res.json({ result: "You are not allowed to grade Assignment", status: 1 });
        }
    }
    catch (error) {
        console.error("Error al crear un registro:", error);
        res.status(500).json({ error: "Error in POST assignmentSubmition/grade" });
    }
}));
module.exports = app;
