import { Request } from "express";
import multer from "multer";
import { extname, join } from "path";
const MIMETYPES = ["image/jpeg","image/png"];

//multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: join(__dirname, "./../uploads"),
    filename: async (req: Request, file: Express.Multer.File, cb: any) => {
      const fileExtension = extname(file.originalname);
      const filename = file.originalname.split(fileExtension)[0];
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