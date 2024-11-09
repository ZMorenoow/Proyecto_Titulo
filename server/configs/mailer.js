import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "zaidmorenosoto@gmail.com",
        pass: "vhux ixmv pkvu frps",
    },
});

transporter.verify().then(() => {
    console.log("Listo para enviar correos")
})

export { transporter };