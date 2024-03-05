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
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
const MIMETYPES = ["image/jpeg", "image/png", "application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];
//multer configuration
const upload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (0, path_1.join)(__dirname, "./../uploads"),
        filename: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            const fileExtension = (0, path_1.extname)(file.originalname);
            const filename = file.originalname.split(fileExtension)[0].replace(/\s+/g, "");
            console.log("Nombre del archivo que se intenta subir al server: ", filename);
            req.body.pathToDB = `${filename}-${Date.now()}${fileExtension}`;
            cb(null, `${filename}-${Date.now()}${fileExtension}`);
        }),
    }),
    fileFilter: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
        if (MIMETYPES.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error(`Only ${MIMETYPES} mimetypes are allowed`));
        }
    }),
    limits: {
        fieldSize: 10000000,
    },
});
// exportamos nuestra funcion
module.exports = upload;
