import { Body, Controller, HttpCode, Post } from '@nestjs/common';

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

@Controller('contact')
export class ContactController {
  @Post()
  @HttpCode(200)
  handle(@Body() body: ContactBody) {
    // En producción, envía email o guarda en DB/CRM.
    // Aquí simplemente aceptamos y devolvemos ok.
    const { name, email, message } = body || {};
    if (!message) return { ok: true, note: 'No message provided' };
    // Minimal redact
    return { ok: true };
  }
}

