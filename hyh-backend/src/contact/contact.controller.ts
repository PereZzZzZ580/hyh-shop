import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ContactService } from './contact.service';

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  motivo?: string;
  numeroPedido?: string;
  message?: string;
  source?: string;
};

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @HttpCode(200)
  async handle(@Body() body: ContactBody) {
    const { message } = body || {};
    if (!message) return { ok: true, note: 'No message provided' };
    try {
      await this.contact.sendMail(body);
    } catch (e) {
      // No interrumpimos al usuario si el correo falla
    }
    return { ok: true };
  }
}

