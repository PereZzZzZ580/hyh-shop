'use client';

import { useState } from 'react';

type Faq = { question: string; answer: string };

const faqs: Faq[] = [
  {
    question: '¿Cómo puedo realizar un pedido?',
    answer:
      'Para realizar un pedido, agrega productos al carrito y sigue el proceso de pago.',
  },
  {
    question: '¿Cuáles son las opciones de pago?',
    answer: 'Aceptamos tarjetas de crédito, débito y pagos electrónicos; O también puedes hablar directamente con nosotros ya que manejamos pago contra entrega en Armenia y calarca.',
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'El tiempo de envío varía entre 3 y 5 días hábiles. si resides en Armenia y calarcá se entrega el mismo dia o al dia siguiente',
  },
];

export default function Ayuda() {
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Ayuda</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {faqs.map((faq, idx) => (
          <FaqCard key={idx} {...faq} />
        ))}
      </div>
    </section>
  );
}

function FaqCard({ question, answer }: Faq) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/20 rounded-lg p-4">
      <button
        className="w-full text-left font-medium"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
      </button>
      {open && <p className="mt-2 text-sm text-white/80">{answer}</p>}
    </div>
  );
}
