export const generateContactEmail = (userEmail, subject, message) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #6cddb8;
              color: #ffffff;
              padding: 20px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
            }
            .content {
              padding: 20px;
              color: #333333;
            }
            .footer {
              background-color: #f1f1f1;
              text-align: center;
              padding: 10px;
              font-size: 14px;
              color: #555555;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
            <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://lh3.googleusercontent.com/d/19g5PHrc1uDN4Wn4cfhH8XUW3MiomTwdh" alt="Watchy Wash Logo" style="width: 150px; height: auto;">
            </div>
          <div class="email-container">
            <div class="header">
                Watch y Wash
            </div>
            <div class="content">
              <p><strong>De:</strong> ${userEmail}</p>
              <p><strong>Asunto:</strong> ${subject}</p>
              <p><strong>Mensaje:</strong></p>
              <p>${message}</p>
            </div>
            <div class="footer">
              <p>Gracias por contactarnos. Nos esforzamos por brindarte el mejor servicio.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  