import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SheetsService {
  private readonly logger = new Logger('SheetsService');

  private get webhookUrl() {
    return process.env.SHEETS_WEBHOOK_URL || '';
  }

  private get secret() {
    return process.env.SHEETS_WEBHOOK_SECRET || '';
  }

  /**
   * Notifica a Google Sheets (o a un Webhook compatible) la creación de un nuevo pedido.
   * No interrumpe el flujo del pedido si falla; solo registra el error.
   */
  async notifyNewOrder(payload: {
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
  }) {
    const url = this.webhookUrl;
    if (!url) return; // deshabilitado si no hay URL
    try {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.secret ? { 'X-Webhook-Secret': this.secret } : {}),
        },
        body: JSON.stringify({ type: 'order.created', data: payload, secret: this.secret || undefined }),
        signal: ctrl.signal,
      } as any);
      clearTimeout(id);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        this.logger.warn(`Sheets webhook responded ${res.status}: ${txt}`);
      }
    } catch (err: any) {
      this.logger.warn(`Sheets webhook error: ${err?.message || err}`);
    }
  }
}

