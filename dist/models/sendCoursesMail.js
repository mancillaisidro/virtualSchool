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
const nodemailer = require("nodemailer");
// definiendo funcion que manda un correo cuando se crea un course
const createCourseMail = (pname, courseName, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWD,
        },
    });
    let mail_options = {
        from: `${process.env.MAILUSER}`,
        to: "is.serv@yopmail.com",
        subject: `Notificacion de actividad, ${pname}`,
        html: `
          <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
          <tr height="200px">  
              <td bgcolor="" width="600px">
                  <h1 style="color: #fff; text-align:center">Se ha creado un course exitosamente</h1>
                  <p  style="color: #fff; text-align:center">
                      El course ${courseName} con el id: ${courseId} se ha creado exitosamente
                  </p>
                  <!-- <p  style="color: #fff; text-align:center">
                      <span style="color: #e84393">${pname}</span> 
                      a la aplicación
                  </p> -->
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
// definiendo funcion que manda correo cuando de elimina un course
const deleteCourseMail = (pname, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWD,
        },
    });
    let mail_options = {
        from: `${process.env.MAILUSER}`,
        to: "is.serv@yopmail.com",
        subject: `Notificacion de actividad, ${pname}`,
        html: `
          <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
          <tr height="200px">  
              <td bgcolor="" width="600px">
                  <h1 style="color: #fff; text-align:center">Se ha eliminado un course exitosamente</h1>
                  <p  style="color: #fff; text-align:center">
                      El course con el id: ${courseId} se ha eliminado exitosamente
                  </p>
                  <!-- <p  style="color: #fff; text-align:center">
                      <span style="color: #e84393">${pname}</span> 
                      a la aplicación
                  </p> -->
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
// definiendo funcion que manda correo cuando se edita un course
const updateCourseMail = (pname, data) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWD,
        },
    });
    let mail_options = {
        from: `${process.env.MAILUSER}`,
        to: "is.serv@yopmail.com",
        subject: `Notificacion de actividad, ${pname}`,
        html: `
          <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
          <tr height="200px">  
              <td bgcolor="" width="600px">
                  <h1 style="color: #fff; text-align:center">Se ha editado un course exitosamente</h1>
                  <p  style="color: #fff; text-align:center">
                      El course con el id: ${data["courseId"]} se ha editado exitosamente con la siguiente informacion:</br>
                      CourseId:  ${data["courseId"]} ,
                      course Name:  ${data["course"]}
                  </p>
                  <!-- <p  style="color: #fff; text-align:center">
                      <span style="color: #e84393">${data.course}</span> 
                      a la aplicación
                  </p> -->
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
module.exports = { createCourseMail, deleteCourseMail, updateCourseMail };
