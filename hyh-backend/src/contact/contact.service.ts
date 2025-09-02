import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  motivo?: string;
  numeroPedido?: string;
  message?: string;
  source?: string;
};

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  async sendMail(body: ContactBody) {
    const {
      MAIL_HOST,
      MAIL_PORT,
      MAIL_USER,
      MAIL_PASS,
      CONTACT_TO,
      CONTACT_FROM,
    } = process.env as Record<string, string | undefined>;

    if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !CONTACT_TO) {
      this.logger.warn('Contact email not configured. Skipping send.');
      return { sent: false };
    }

    const port = Number(MAIL_PORT);
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: MAIL_USER && MAIL_PASS ? { user: MAIL_USER, pass: MAIL_PASS } : undefined,
    });

    const subjectPrefix = body.motivo ? `[${body.motivo}] ` : '';
    const subject = `${subjectPrefix}Nuevo mensaje de contacto`;

    const textLines = [
      `Nombre: ${body.name || '—'}`,
      `Email: ${body.email || '—'}`,
      `Teléfono: ${body.phone || '—'}`,
      `Motivo: ${body.motivo || '—'}`,
      `Nº Pedido: ${body.numeroPedido || '—'}`,
      `Origen: ${body.source || 'web'}`,
      '',
      (body.message || '').trim(),
    ];

    await transporter.sendMail({
      from: CONTACT_FROM || MAIL_USER,
      to: CONTACT_TO,
      subject,
      text: textLines.join('\n'),
      replyTo: body.email,
    });

    return { sent: true };
  }
}

