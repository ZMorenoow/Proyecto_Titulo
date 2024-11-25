import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "watchywash@gmail.com",
        pass: "hgqx clxu hjip rxnd",
    },
});

transporter.verify().then(() => {
    console.log("Listo para enviar correos")
})

export { transporter };