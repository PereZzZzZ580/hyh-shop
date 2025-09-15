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

  // CallMeBot (alternativa gratuita y rápida; no oficial)
  private get callmebotPhone() {
    return process.env.CALLMEBOT_PHONE || '';
  }

  private get callmebotApiKey() {
    return process.env.CALLMEBOT_APIKEY || '';
  }

  private formatCurrencyCOP(n: number) {
    try { return n.toLocaleString('es-CO'); } catch { return String(n); }
  }

  private buildTextMessage(p: OrderPayload) {
    const fecha = new Date(p.createdAt || Date.now()).toLocaleString('es-CO');
    const items = p.items.map(it => `• ${it.name} x${it.qty} — $${this.formatCurrencyCOP(it.unitPrice * it.qty)}`).join('\n');
    return [
      `Nuevo pedido 🚨`,
      `ID: ${p.orderId}`,
      `Fecha: ${fecha}`,
      `Pago: ${p.paymentMethod}`,
      `Estado: ${p.status} / ${p.paymentStatus}`,
      p.city ? `Ciudad: ${p.city}` : undefined,
      p.contactName ? `Contacto: ${p.contactName}` : undefined,
      p.contactPhone ? `Tel: ${p.contactPhone}` : undefined,
      `Subtotal: $${this.formatCurrencyCOP(p.totals.subtotal)}`,
      `Envío: $${this.formatCurrencyCOP(p.totals.shippingTotal)}`,
      p.totals.discountTotal ? `Descuento: -$${this.formatCurrencyCOP(p.totals.discountTotal)}` : undefined,
      `TOTAL: $${this.formatCurrencyCOP(p.totals.grandTotal)}`,
      `Items:\n${items}`,
    ].filter(Boolean).join('\n');
  }

  /**
   * Envía notificación por WhatsApp usando CallMeBot (gratuito, no oficial).
   * Solo requiere CALLMEBOT_PHONE y CALLMEBOT_APIKEY.
   */
  async notifyAdminNewOrder(p: OrderPayload) {
    const bodyText = this.buildTextMessage(p);
    // CallMeBot (gratuito y rápido; uso bajo tu responsabilidad)
    if (this.callmebotPhone && this.callmebotApiKey) {
      try {
        const textParam = encodeURIComponent(bodyText).replace(/%20/g, '+');
        const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(this.callmebotPhone)}&text=${textParam}&apikey=${encodeURIComponent(this.callmebotApiKey)}`;
        const ctrl = new AbortController();
        const id = setTimeout(() => ctrl.abort(), 7000);
        const res = await fetch(url, { method: 'GET', signal: ctrl.signal } as any);
        clearTimeout(id);
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          this.logger.warn(`CallMeBot notify ${res.status}: ${txt}`);
        }
      } catch (err: any) {
        this.logger.warn(`CallMeBot error: ${err?.message || err}`);
      }
    }
  }
}
