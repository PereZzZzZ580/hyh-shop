import { Injectable, Logger } from '@nestjs/common';
import nodemailer from 'nodemailer';

type OrderPayload = {
  orderId: string;
  createdAt: string;
  userId: string | null;
  paymentMethod: 'COD' | 'WHATSAPP' | 'WOMPI';
  status: string;
  paymentStatus: string;
  totals: { subtotal: number; discountTotal: number; shippingTotal: number; grandTotal: number };
  contactName?: string | null;
  contactPhone?: string | null;
  city?: string | null;
  items: { name: string; qty: number; unitPrice: number }[];
};

@Injectable()
export class OrdersEmailService {
  private readonly logger = new Logger('OrdersEmailService');

  private csvEsc(val: any) {
    const s = String(val ?? '');
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  private buildCsv(payload: OrderPayload) {
    const headers = [
      'orderId',
      'createdAt',
      'userId',
      'paymentMethod',
      'status',
      'paymentStatus',
      'city',
      'contactName',
      'contactPhone',
      'subtotal',
      'shippingTotal',
      'discountTotal',
      'grandTotal',
      'items',
    ];
    const itemsStr = payload.items
      .map((i) => `${i.name} x${i.qty} ($${i.unitPrice})`)
      .join(' | ');
    const row = [
      payload.orderId,
      payload.createdAt,
      payload.userId ?? '',
      payload.paymentMethod,
      payload.status,
      payload.paymentStatus,
      payload.city ?? '',
      payload.contactName ?? '',
      payload.contactPhone ?? '',
      payload.totals.subtotal,
      payload.totals.shippingTotal,
      payload.totals.discountTotal,
      payload.totals.grandTotal,
      itemsStr,
    ];
    return (
      headers.map((h) => this.csvEsc(h)).join(',') +
      '\n' +
      row.map((v) => this.csvEsc(v)).join(',') +
      '\n'
    );
  }

  async notifyNewOrder(payload: OrderPayload) {
    const {
      MAIL_HOST,
      MAIL_PORT,
      MAIL_USER,
      MAIL_PASS,
      CONTACT_FROM,
    } = process.env as Record<string, string | undefined>;
    const to = process.env.ORDER_NOTIFY_TO || process.env.CONTACT_TO;

    if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !to) {
      this.logger.warn('Email not configured (MAIL_* or ORDER_NOTIFY_TO missing). Skipping send.');
      return { sent: false };
    }

    const port = Number(MAIL_PORT);
    const transporter = nodemailer.createTransport({
      host: MAIL_HOST,
      port,
      secure: port === 465,
      auth: MAIL_USER && MAIL_PASS ? { user: MAIL_USER, pass: MAIL_PASS } : undefined,
    });

    const subject = `Nuevo pedido ${payload.orderId}`;
    const csv = this.buildCsv(payload);
    const text = [
      `Nuevo pedido` ,
      `ID: ${payload.orderId}`,
      `Fecha: ${new Date(payload.createdAt).toLocaleString('es-CO')}`,
      `Pago: ${payload.paymentMethod}`,
      `Estado: ${payload.status} / ${payload.paymentStatus}`,
      payload.city ? `Ciudad: ${payload.city}` : undefined,
      payload.contactName ? `Contacto: ${payload.contactName}` : undefined,
      payload.contactPhone ? `Tel: ${payload.contactPhone}` : undefined,
      `Total: $${payload.totals.grandTotal.toLocaleString('es-CO')}`,
      '',
      'Se adjunta CSV con el detalle.',
    ].filter(Boolean).join('\n');

    await transporter.sendMail({
      from: CONTACT_FROM || MAIL_USER,
      to,
      subject,
      text,
      attachments: [
        {
          filename: `pedido-${payload.orderId}.csv`,
          content: csv,
        },
      ],
    });

    return { sent: true };
  }
}

