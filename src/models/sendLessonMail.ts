// definiendo funcion que manda un correo cuando se crea un course
const createLessonMail = async (
  pname: String,
  lessonName: String,
  lessonId: Number
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
    to: "is.serv@yopmail.com",
    subject: `Notificacion de actividad, ${pname}`,
    html: `
          <table border="0" cellpadding="0" cellspacing="0" width="600px" background-color="#2d3436" bgcolor="#2d3436">
          <tr height="200px">  
              <td bgcolor="" width="600px">
                  <h1 style="color: #fff; text-align:center">Se ha creado un lesson exitosamente</h1>
                  <p  style="color: #fff; text-align:center">
                      Lesson Name ${lessonName} con el id: ${lessonId} se ha creado exitosamente
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
  transporter.sendMail(mail_options, (error: Error, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log("El correo se envío correctamente " + info.response);
    }
  });
};
// definiendo funcion que manda correo cuando de elimina un course
const deleteLessonMail = async (pname: String, lessonId: Number) => {
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
                  <h1 style="color: #fff; text-align:center">Se ha eliminado un lesson exitosamente</h1>
                  <p  style="color: #fff; text-align:center">
                      La Lesson con el id: ${lessonId} se ha eliminado exitosamente
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
  transporter.sendMail(mail_options, (error: Error, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log("El correo se envío correctamente " + info.response);
    }
  });
};
// definiendo funcion que manda correo cuando se edita un course
const updateLessonMail = async (pname: String, data: any) => {
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
                      La lesson con el id: ${data["lessonId"]} se ha editado exitosamente con la siguiente informacion:</br>
                      LessonId:  ${data["lessonId"]} ,
                      Lesson Name:  ${data["lesson"]}
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
  transporter.sendMail(mail_options, (error: Error, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log("El correo se envío correctamente " + info.response);
    }
  });
};
module.exports = { createLessonMail, deleteLessonMail, updateLessonMail };
