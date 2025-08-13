import React from "react";

type Props = {
  order: {
    id: string;
    customer: { nombre: string };
  };
};

export default function ShareButtons({ order }: Props) {
  const url = typeof window !== "undefined"
    ? window.location.href
    : `https://tu-dominio.com/pedido/${order.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    alert("Enlace copiado al portapapeles");
  };

  const whatsappMsg = encodeURIComponent(
    `¡Hola! Aquí está el pedido de ${order.customer.nombre}: ${url}`
  );

  return (
    <div className="flex gap-2">
      <a
        href={`https://wa.me/?text=${whatsappMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-10 rounded-lg px-4 border border-green-500 text-green-700 inline-flex items-center"
      >
        Compartir por WhatsApp
      </a>
      <button
        type="button"
        onClick={handleCopy}
        className="h-10 rounded-lg px-4 border border-blue-500 text-blue-700 inline-flex items-center"
      >
        Copiar enlace
      </button>
    </div>
  );
}