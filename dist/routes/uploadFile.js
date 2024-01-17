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
const { authenticateToken } = require("./../models/auth");
const upload = require("./../models/uploadFile");
const app = express_1.default.Router();
// Ruta para manejar la subida de archivos
app.post("/uploadCourse", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        // El archivo no se subió correctamente
        return res
            .status(400)
            .json({ error: "No se proporcionó ningún archivo." });
    }
    // Aquí puedes hacer algo con el archivo subido
    console.log(req.file);
    console.log("Estamos recibiendo la petición");
    res.json("File saved succesfully");
}));
module.exports = app;
