import express, { Request, Response } from "express";
const app = express.Router();
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

interface contenido {
    mailTo: string,
    subject: string,
    message: number
}
// definiendo funcion que manda un correo cuando se crea un course
const createCourseMail = async (
    contenido: contenido
  ) => {
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
    transporter.sendMail(mail_options, (error: Error, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("El correo se envío correctamente " + info.response);
      }
    });
  };
app.post("", async (req: Request, res: Response) => {
    console.log('asdasdasddd')
  try {
    const contenido: contenido = req.body;
    await createCourseMail(contenido);
    res.json({ result: "email sent"})
  } catch (error) {
    console.error("Error trying to send an email", error);
    res.status(500).json({ error: "Error trying to send an email" });
  }
})
module.exports = app;

