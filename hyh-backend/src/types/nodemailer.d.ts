// Ligero shim de tipos para Nodemailer cuando no estén disponibles los oficiales
declare module 'nodemailer' {
  interface AuthOptions {
    user: string;
    pass: string;
  }
  interface TransportOptions {
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: AuthOptions;
  }
  interface SendMailOptions {
    from?: string;
    to?: string | string[];
    subject?: string;
    text?: string;
    html?: string;
    replyTo?: string;
    [key: string]: any;
  }
  interface Transporter {
    sendMail(options: SendMailOptions): Promise<any>;
  }
  function createTransport(options: TransportOptions): Transporter;
  const nodemailer: { createTransport: typeof createTransport };
  export = nodemailer;
}
