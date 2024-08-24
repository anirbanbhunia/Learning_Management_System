import nodemailer from "nodemailer"

const sendEmail = async function(email,subject,message){

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.SMTP_FROM_EMAIL, // SMTP Username or Gmail address
          pass: process.env.SMTP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: {
            name: process.env.SMTP_USERNAME,
            address: process.env.SMTP_FROM_EMAIL
        }, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: message, // plain text body
        html: `<b>${message}</b>`, // html body
      });
}

export default sendEmail