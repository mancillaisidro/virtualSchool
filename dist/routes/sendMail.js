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
const nodemailer = require("nodemailer");
// definiendo funcion que manda un correo cuando se crea un course
const createCourseMail = (contenido) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWD,
        },
    });
    let mail_options = {
        from: `${process.env.MAILUSER}`,
        to: contenido.mailTo,
        subject: `${contenido.subject}`,
        html: `
            <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
            <tr height="200px">  
                <td bgcolor="" width="600px">
                    <h1 style="color: #fff; text-align:center">New message from ePIN</h1>
                    <p  style="color: #fff; text-align:center">
                        ${contenido.message}
                    </p>
                </td>
            </tr>
            <tr bgcolor="#fff">
                <td style="text-align:center">
                    <p style="color: #000">Virtual School</p>
                </td>
            </tr>
            </table>
        
        `,
    };
    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log("El correo se envío correctamente " + info.response);
        }
    });
});
app.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('asdasdasddd');
    try {
        const contenido = req.body;
        yield createCourseMail(contenido);
        res.json({ result: "email sent" });
    }
    catch (error) {
        console.error("Error trying to send an email", error);
        res.status(500).json({ error: "Error trying to send an email" });
    }
}));
module.exports = app;
