import { Request } from "express";
import multer from "multer";
import path, { extname, join } from "path";
const MIMETYPES = ["image/jpeg","image/png","application/pdf", "application/vnd.openxmlformats-officedocument.presentationml.presentation"];

//multer configuration

let tempraryImageDirectory: string;
if (process.env.DEV && process.env.DEV === 'Yes') {
  tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
} else {
  tempraryImageDirectory = '/tmp/';
}

const upload = multer({
  storage: multer.diskStorage({
    destination: tempraryImageDirectory,
    filename: async (req: Request, file: Express.Multer.File, cb: any) => {
      const fileExtension = extname(file.originalname);
      const filename = file.originalname.split(fileExtension)[0].replace(/\s+/g,"");
      console.log("Nombre del archivo que se intenta subir al server: ",filename);
      req.body.pathToDB = `${filename}-${Date.now()}${fileExtension}`;
      cb(null, `${filename}-${Date.now()}${fileExtension}`);
    },
  }),
  fileFilter: async (req: Request, file: Express.Multer.File, cb: any) => {
    if (MIMETYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only ${MIMETYPES} mimetypes are allowed`));
    }
  },
  limits: {
    fieldSize: 10_000_000,
  },
});


// exportamos nuestra funcion
  module.exports = upload;