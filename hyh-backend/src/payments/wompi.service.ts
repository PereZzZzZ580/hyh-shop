import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

@Injectable()
export class WompiService {
  private get privateKey() {
    const v = process.env.WOMPI_PRIVATE_KEY;
    if (!v) throw new Error('Missing env var: WOMPI_PRIVATE_KEY');
    return v;
  }

  private get publicKey() {
    const v = process.env.WOMPI_PUBLIC_KEY;
    if (!v) throw new Error('Missing env var: WOMPI_PUBLIC_KEY');
    return v;
  }

  private get integrityKey() {
    const v = process.env.WOMPI_INTEGRITY_KEY;
    if (!v) throw new Error('Missing env var: WOMPI_INTEGRITY_KEY');
    return v;
  }

  private get apiBase() {
    return process.env.WOMPI_ENV === 'production' ? 'https://production.wompi.co' : 'https://sandbox.wompi.co';
  }

  private readonly checkoutBase = 'https://checkout.wompi.co/p/';

  buildCheckoutUrl(params: {
    reference: string;
    amountInCents: number;
    currency: string;
    redirectUrl: string;
    customerName?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
  }) {
    const q = new URLSearchParams();
    q.set('public-key', this.publicKey);
    q.set('amount-in-cents', String(params.amountInCents));
    q.set('currency', params.currency);
    q.set('reference', params.reference);
    q.set('redirect-url', params.redirectUrl);
    // Firma de integridad requerida por Wompi
    // Según la documentación de Wompi, la firma de integridad es
    // SHA-256 sobre la concatenación: reference + amountInCents + currency + integrity_key
    const signatureRaw = `${params.reference}${params.amountInCents}${params.currency}${this.integrityKey}`;
    const integrity = createHash('sha256').update(signatureRaw).digest('hex');
    q.set('signature:integrity', integrity);
    if (params.customerName) q.set('customer-data:full-name', params.customerName);
    if (params.customerPhone) q.set('customer-data:phone-number', params.customerPhone);
    if (params.customerEmail) q.set('customer-email', params.customerEmail);
    return `${this.checkoutBase}?${q.toString()}`;
  }

  async fetchTransaction(txId: string): Promise<any> {
    const url = `${this.apiBase}/v1/transactions/${encodeURIComponent(txId)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${this.privateKey}` },
    } as any);
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`Wompi error (${res.status}): ${t}`);
    }
    return res.json();
  }
}
