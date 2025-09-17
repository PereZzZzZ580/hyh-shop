import { Injectable, Logger } from '@nestjs/common';

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
export class WhatsappNotifyService {
  private readonly logger = new Logger('WhatsappNotifyService');

  // CallMeBot (opcion rapida, no oficial)
  private get callmebotPhone() {
    return process.env.CALLMEBOT_PHONE || '';
  }

  private get callmebotApiKey() {
    return process.env.CALLMEBOT_APIKEY || '';
  }

  private formatCurrencyCOP(n: number) {
    try {
      return n.toLocaleString('es-CO');
    } catch {
      return String(n);
    }
  }

  private buildItemsBlock(p: OrderPayload) {
    if (!p.items?.length) return 'Items:\n(sin items)';
    const lines = p.items.map((it) => `- ${it.name} x${it.qty} -> $${this.formatCurrencyCOP(it.unitPrice * it.qty)}`);
    return ['Items:', ...lines].join('\n');
  }

  private buildMessage(p: OrderPayload, headline: string) {
    const date = new Date(p.createdAt || Date.now()).toLocaleString('es-CO');
    const lines = [
      headline,
      `Pedido: ${p.orderId}`,
      `Fecha: ${date}`,
      `Pago: ${p.paymentMethod}`,
      `Estado: ${p.status} / ${p.paymentStatus}`,
      p.city ? `Ciudad: ${p.city}` : undefined,
      p.contactName ? `Contacto: ${p.contactName}` : undefined,
      p.contactPhone ? `Tel: ${p.contactPhone}` : undefined,
      `Subtotal: $${this.formatCurrencyCOP(p.totals.subtotal)}`,
      `Envio: $${this.formatCurrencyCOP(p.totals.shippingTotal)}`,
      p.totals.discountTotal ? `Descuento: -$${this.formatCurrencyCOP(p.totals.discountTotal)}` : undefined,
      `Total: $${this.formatCurrencyCOP(p.totals.grandTotal)}`,
      '',
      this.buildItemsBlock(p),
    ];
    return lines.filter(Boolean).join('\n');
  }

  private async sendCallMeBotMessage(text: string) {
    if (!this.callmebotPhone || !this.callmebotApiKey) {
      return;
    }
    try {
      const textParam = encodeURIComponent(text).replace(/%20/g, '+');
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(this.callmebotPhone)}&text=${textParam}&apikey=${encodeURIComponent(this.callmebotApiKey)}`;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const res = await fetch(url, { method: 'GET', signal: ctrl.signal } as any);
      clearTimeout(timer);
      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        this.logger.warn(`CallMeBot notify ${res.status}: ${txt}`);
      }
    } catch (err: any) {
      this.logger.warn(`CallMeBot error: ${err?.message || err}`);
    }
  }

  async notifyAdminNewOrder(p: OrderPayload) {
    const bodyText = this.buildMessage(p, 'Nuevo pedido');
    await this.sendCallMeBotMessage(bodyText);
  }

  async notifyPaymentApproved(p: OrderPayload) {
    const bodyText = this.buildMessage(p, 'Pago aprobado por Wompi');
    await this.sendCallMeBotMessage(bodyText);
  }
}
