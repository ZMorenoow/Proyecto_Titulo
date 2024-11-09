import { transporter } from "../configs/mailer.js";

const sendEmail = async (to, subject, htmlContent) => {
    try {
      await transporter.sendMail({
        from: "zaidmorenosoto@gmail.com",
        to,
        subject,
        html: htmlContent,
      });
      console.log('Correo enviado exitosamente a:', to);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  };

  export { sendEmail };