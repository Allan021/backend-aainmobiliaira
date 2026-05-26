const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.host = process.env.SMTP_HOST;
    this.port = process.env.SMTP_PORT || 587;
    this.user = process.env.SMTP_USER;
    this.pass = process.env.SMTP_PASS;
    this.from = process.env.SMTP_FROM || 'A&A Inmobiliaria <no-reply@aabienes.com>';

    if (this.host && this.user && this.pass) {
      this.transporter = nodemailer.createTransport({
        host: this.host,
        port: Number(this.port),
        secure: this.port == 465,
        auth: {
          user: this.user,
          pass: this.pass,
        },
      });
      console.log('[EmailService] SMTP transporter initialized successfully.');
    } else {
      this.transporter = null;
      console.warn('[EmailService] SMTP credentials missing. Using Console log email fallback.');
    }
  }

  async sendWelcomeEmail(toEmail, toName, password) {
    const loginUrl = 'https://www.aabienes.com/admin/login';
    const subject = 'Bienvenido al equipo de A&A Inmobiliaria';
    
    const textContent = `
Hola ${toName},

Has sido agregado como miembro del equipo (administrador) en A&A Inmobiliaria.

Aquí tienes tus credenciales para acceder al panel de administración:
- Enlace de acceso: ${loginUrl}
- Correo electrónico: ${toEmail}
- Contraseña temporal: ${password}

Por seguridad, te recomendamos cambiar tu contraseña una vez que inicies sesión.

Atentamente,
El equipo de A&A Inmobiliaria
    `.trim();

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E6E0D2; border-radius: 12px; background-color: #FAF8F3; color: #111113;">
        <h2 style="color: #8C6F1C; margin-bottom: 20px;">¡Bienvenido al equipo, ${toName}!</h2>
        <p>Has sido registrado como administrador en la plataforma de <strong>A&A Inmobiliaria</strong>.</p>
        <p>A partir de ahora podrás acceder al panel de control para gestionar propiedades, lotificaciones, leads y ventas.</p>
        
        <div style="background-color: #FFFFFF; border: 1px solid #E6E0D2; padding: 18px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #111113; font-size: 15px;">Tus credenciales de acceso:</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #5A5A63; width: 140px;"><strong>Página de ingreso:</strong></td>
              <td style="padding: 6px 0;"><a href="${loginUrl}" style="color: #D4B254; font-weight: 600; text-decoration: none;">${loginUrl}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #5A5A63;"><strong>Usuario / Email:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; color: #111113;">${toEmail}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #5A5A63;"><strong>Contraseña temporal:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #111113;">${password}</td>
            </tr>
          </table>
        </div>

        <p style="font-size: 13px; color: #5A5A63;">Por motivos de seguridad, te recomendamos cambiar tu contraseña una vez que inicies sesión.</p>
        <hr style="border: 0; border-top: 1px solid #E6E0D2; margin: 25px 0;" />
        <p style="font-size: 11px; color: #9A9383; text-align: center; margin: 0;">Este es un correo automático de A&A Inmobiliaria. Por favor, no respondas a este mensaje.</p>
      </div>
    `;

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: this.from,
          to: toEmail,
          subject: subject,
          text: textContent,
          html: htmlContent,
        });
        console.log(`[EmailService] Welcome email sent successfully to ${toEmail}`);
      } catch (err) {
        console.error(`[EmailService] Failed to send email to ${toEmail}:`, err.message);
        throw err;
      }
    } else {
      console.log('\n========================================================================');
      console.log('[EmailService MOCK] ENVIANDO CORREO ELECTRÓNICO (SMTP no configurado)');
      console.log(`Para: ${toName} <${toEmail}>`);
      console.log(`Asunto: ${subject}`);
      console.log('------------------------------------------------------------------------');
      console.log(textContent);
      console.log('========================================================================\n');
    }
  }
}

module.exports = EmailService;
