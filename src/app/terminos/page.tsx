export default function Terminos() {
  return (
    <section className="space-y-8">
      <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
      <p className="text-sm text-white/60">Última actualización: 10/09/2025</p>

      <div>
        <h2 className="text-xl font-semibold">1. Aceptación de los términos</h2>
        <p className="mt-2">
          Al usar HYH Shop (HYH Barber Home), comprar o solicitar servicios, aceptas
          estos Términos. Si no estás de acuerdo, por favor no uses la plataforma.
        </p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">2. Identificación del responsable</h2>
        <p className="mt-2">Operamos como persona natural registrada ante la DIAN, con RUT vigente.</p>
        <p className="mt-2">Responsable: Juan Andres Perez Gallego (C.C. 1091202201) — Armenia, Quindío, Colombia.</p>
        <p className="mt-2">RUT/NIT: [indica tu número aquí].</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">3. Objeto del servicio</h2>
        <p className="mt-2">Venta de productos físicos a través de nuestra tienda en línea.</p>
        <p className="mt-2">Entregas contra entrega en Armenia y Calarcá; envíos a otros municipios conforme a la Política de Envíos.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">4. Precios y pagos</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>Precios en COP e incluyen impuestos cuando aplique.</li>
          <li>En Armenia y Calarcá: pago contra entrega.</li>
          <li>Otros municipios: pago anticipado por métodos habilitados.</li>
        </ul>
        <div className="mt-3">
          <h3 className="font-semibold">Pagos con Wompi</h3>
          <ul className="list-disc pl-6 space-y-2 mt-1">
            <li>El pago se realiza en la plataforma segura de Wompi. Ellos procesan los datos sensibles.</li>
            <li>HYH no almacena ni procesa números de tarjeta ni CVV. Recibimos únicamente estado, identificador y referencia del pedido.</li>
            <li>La confirmación del pedido se hace tras la verificación del pago.</li>
            <li>Consulta <a className="underline" href="https://legal.wompi.co/terminos-y-condiciones" target="_blank">Términos</a> y <a className="underline" href="https://legal.wompi.co/politica-de-privacidad" target="_blank">Privacidad</a> de Wompi.</li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">5. Propiedad intelectual</h2>
        <p className="mt-2">El contenido del sitio es propiedad de HYH Shop. Prohibida su reproducción sin autorización.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">6. Uso permitido</h2>
        <ul className="mt-2 list-disc pl-6 space-y-1">
          <li>Uso personal y lícito de la plataforma.</li>
          <li>Prohibido publicar contenido ilegal u ofensivo y vulnerar la seguridad.</li>
          <li>Prohibido suministrar información falsa.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">7. Protección de datos personales</h2>
        <p className="mt-2">Tratamos tus datos conforme a la Ley 1581 de 2012. Ver Política de Privacidad.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">8. Política de devoluciones</h2>
        <p className="mt-2">Hasta 5 días calendario tras la entrega. Producto sin uso y en empaque original (ver sección Devoluciones).</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">9. Limitación de responsabilidad</h2>
        <p className="mt-2">No respondemos por retrasos por fuerza mayor. La responsabilidad se limita al valor del producto.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">10. Asesor de corte (cámara y galería)</h2>
        <ul className="mt-2 list-disc pl-6 space-y-2">
          <li>Puede requerir permiso de cámara o carga de imagen.</li>
          <li>Imágenes/vídeo se procesan localmente en tu navegador; no se suben ni almacenan en nuestros servidores.</li>
          <li>Debes contar con derechos sobre las imágenes que cargues.</li>
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">11. Modificaciones</h2>
        <p className="mt-2">Podemos actualizar estos términos. Publicaremos la versión vigente con fecha.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">12. Legislación y jurisdicción</h2>
        <p className="mt-2">Se rigen por la legislación colombiana. Competencia: tribunales de Armenia (Quindío).</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">13. Contacto</h2>
        <p className="mt-2">
          Correo: <a className="text-blue-600 underline" href="mailto:hyhbarbershop@gmail.com">hyhbarbershop@gmail.com</a> —
          WhatsApp: <a className="text-blue-600 underline" href="https://wa.me/3146905870">3146905870</a> -
          <a className="text-blue-600 underline" href="https://wa.me/3138907119"> 3138907119</a>
        </p>
      </div>
    </section>
  );
}

