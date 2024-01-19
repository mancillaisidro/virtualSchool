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
const path_1 = __importDefault(require("path"));
const app = express_1.default.Router();
const { getFileName } = require("./../models/lessons");
// async function checkIfLessonExist(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const id = req.query.lessonId ?? 4009;
//   if (id === null || id === "" || id === undefined)
//     res.status(401).json({ message: "lessonId is null, undefined or empty" });
//   try {
//     const query =
//       'SELECT "lessonId", "pathFile" FROM public.courses WHERE "lessonId" = $1';
//     const pool = new Pool(config);
//     const result = await pool.query(query, [id]);
//     if (result.rows.length === 0) {
//       res.status(401).json("lessonId not found");
//     } else {
//       req.params.pathFile = result.rows[0].pathFile;
//       next();
//     }
//   } catch (error) {
//     console.error("Error al obtener el registro:", error);
//     res
//       .status(401)
//       .json(
//         "Database connection error, please go to the terminal to see more details."
//       );
//   }
// }
// Ruta para manejar la descarga de archivos, espera como parametros un json object del tipo:
// { "lessonId": 4000 }
app.get("", getFileName, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(__dirname, `./../uploads/${req.params.pathFile}`);
        res.download(filePath);
    }
    catch (error) {
        console.log("Server error when trying to send the file to the client", error);
        res
            .status(400)
            .json("Server error, please go to terminal to see more details about this error");
    }
}));
module.exports = app;
