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
const pg_1 = require("pg");
const config = require("./../routes/dbProductionConfig");
const upload = require("./../models/uploadFile");
const app = express_1.default.Router();
// const {checkIfLessonExist, savePathInDB} = require('./../models/lessons');
function checkIfLessonExist(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req.body.lessonId) !== null && _a !== void 0 ? _a : 0;
        if (id === null || id === "" || id === undefined)
            res.status(401).json({ message: "lessonId is null, undefined or empty" });
        try {
            const query = 'SELECT "lessonId" FROM public.courses WHERE "lessonId" = $1';
            const pool = new pg_1.Pool(config);
            console.log("valor de lessonId que se ejecutara en la consulta", id);
            const result = yield pool.query(query, [id]);
            if (result.rows.length === 0) {
                res.status(401).json("lessonId not found");
            }
            else {
                req.body.lessonId = result.rows[0].lessonId;
                next();
            }
        }
        catch (error) {
            console.error("Error al obtener el registro:", error);
            res
                .status(401)
                .json("Database connection error, please go to the terminal to see more details.");
        }
    });
}
function savePathInDB(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('estamos en savePath');
        try {
            const query = 'UPDATE public.exam SET file = $1 WHERE exam_id = $2 RETURNING *';
            const values = [req.body.pathToDB, req.body.examId];
            const pool = new pg_1.Pool(config);
            const result = yield pool.query(query, values);
            if (result.rows.length === 0) {
                res.json("ExamId does not exist in the database.");
            }
            else {
                next();
            }
        }
        catch (error) {
            console.error("Error al actualizar el registro:", error);
            res.json("Database error, go to the terminal to see more info about this error.");
        }
    });
}
// Ruta para manejar la subida de archivos
app.post("", upload.single("file"), /* middleware function to store the file in the server */ savePathInDB, /* once the file is stored in the server, we save the file name in the database */ (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('estamos en POST method');
    if (!req.file) {
        // El archivo no se subió correctamente
        return res
            .status(400)
            .json({ error: "Please select a file to be uploaded." });
    }
    res.json("File saved succesfully");
}));
module.exports = app;
