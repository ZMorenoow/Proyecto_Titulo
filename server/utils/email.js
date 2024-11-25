import { transporter } from "../configs/mailer.js";

const sendEmail = async (to, subject, htmlContent) => {
    try {
      await transporter.sendMail({
        from: "watchywash@gmail.com",
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

  const sendEmailContact = async (from, subject, htmlContent) => {
    try {
      const mailOptions = {
        from,
        to: "watchywash@gmail.com", 
        subject,
        html: htmlContent,
        replyTo: from, 
      };
  
      await transporter.sendMail(mailOptions);
  
      console.log('Correo enviado exitosamente desde:', from, 'a:', mailOptions.to);
    } catch (error) {
      console.error('Error enviando correo:', error);
      throw new Error('No se pudo enviar el correo.');
    }
  };

  export { sendEmail, sendEmailContact };