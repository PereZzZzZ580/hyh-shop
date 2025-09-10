export default function Privacidad() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Política de Privacidad</h1>
      <p className="text-sm text-white/60">Última actualización: 10/09/2025</p>

      <div className="space-y-6">
        <div>
          <h2 className="font-semibold">1. Responsable del Tratamiento</h2>
          <p>
            HYH Shop – HYH Barber Home opera como persona natural registrada ante la DIAN,
            con RUT vigente. Responsable del tratamiento de datos:
          </p>
          <p>
            Juan Andres Perez Gallego (C.C. 1091202201), con domicilio en Armenia,
            Quindío, Colombia. RUT/NIT: [1 0 9 1 2 0 2 2 0 1].
          </p>
        </div>

        <div>
          <h2 className="font-semibold">2. ¿Por qué recogemos tus datos?</h2>
          <p>
            Para procesar pedidos, coordinar entregas, atender consultas y aplicar
            políticas de envíos/devoluciones. Recopilamos solo la información necesaria.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">3. ¿Qué datos recopilamos?</h2>
          <p>
            Datos personales: nombre, dirección, teléfono, correo y detalles del pedido.
          </p>
          <p>
            Datos técnicos de navegación: IP, tipo de navegador y preferencias de la
            tienda (cookies), cuando estén habilitadas.
          </p>
        </div>

        <div>
          <h2 className="font-semibold">4. ¿Cómo recopilamos tus datos?</h2>
          <p>Al registrarte, comprar, contactarnos o navegar por el sitio (cookies).</p>
        </div>

        <div>
          <h2 className="font-semibold">5. Asesor de corte: cámara y galería</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Para usar el Asesor puedes otorgar permiso de cámara o subir una foto.</li>
            <li>Las imágenes y el video se procesan únicamente en tu navegador (p. ej., WebAssembly/MediaPipe). No se envían a nuestro servidor ni a terceros.</li>
            <li>No almacenamos copias de tus imágenes. Permanecen en memoria temporal y se descartan al cerrar o recargar la página.</li>
            <li>No hacemos identificación personal ni reconocimiento biométrico; solo estimamos rasgos geométricos para sugerir estilos.</li>
            <li>Puedes revocar el permiso de cámara desde la configuración del navegador.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">6. Derechos que tienes (Ley 1581 de 2012)</h2>
          <p>Conocer, acceder, corregir, suprimir tus datos o revocar autorización.</p>
          <p>Para ejercerlos, escríbenos a nuestro correo de contacto.</p>
        </div>

        <div>
          <h2 className="font-semibold">7. ¿Con quién compartimos tus datos?</h2>
          <p>Solo con terceros necesarios para operar el servicio:</p>
          <ul className="list-disc pl-6">
            <li>Transportadoras para entregas.</li>
            <li>Proveedor de pagos cuando corresponde (por ejemplo, Wompi).</li>
          </ul>
          <p>No vendemos ni compartimos datos con fines de marketing externo.</p>
        </div>

        <div>
          <h2 className="font-semibold">8. Pagos con Wompi</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Si eliges pagar con Wompi, te redirigimos a su plataforma segura. Los datos sensibles (tarjeta, CVV, autenticación) los trata Wompi.</li>
            <li>HYH no ve ni almacena datos de tu tarjeta; solo recibimos estado de la transacción, identificador y referencia del pedido.</li>
            <li>Políticas de Wompi: <a className="underline" href="https://legal.wompi.co/politica-de-privacidad" target="_blank">Privacidad</a> y <a className="underline" href="https://legal.wompi.co/terminos-y-condiciones" target="_blank">Términos</a>.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">9. Conservación</h2>
          <p>Conservamos datos mientras seas cliente y hasta 5 años por fines legales/contables; luego los eliminamos o anonimizamos.</p>
        </div>

        <div>
          <h2 className="font-semibold">10. Seguridad</h2>
          <ul className="list-disc pl-6">
            <li>Conexiones cifradas (SSL/TLS).</li>
            <li>Acceso restringido a personal autorizado.</li>
            <li>Cookies bajo tu consentimiento y posibilidad de desactivarlas.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold">11. Cookies</h2>
          <p>Usamos cookies técnicas para mejorar la experiencia. Puedes desactivarlas en tu navegador.</p>
        </div>

        <div>
          <h2 className="font-semibold">12. Cambios en esta política</h2>
          <p>Publicaremos aquí cualquier actualización de esta política.</p>
        </div>

        <div>
          <h2 className="font-semibold">13. Base legal</h2>
          <p>Aplicamos la Ley 1581 de 2012 y principios de finalidad, consentimiento, seguridad y confidencialidad. Supervisión: SIC.</p>
        </div>

        <div>
          <h2 className="font-semibold">14. Contacto</h2>
          <p>Correo: <a className="text-blue-600 hover:underline" href="mailto:hyhbarbershop@gmail.com">hyhbarbershop@gmail.com</a></p>
          <p>WhatsApp: <a className="text-blue-600 hover:underline" href="https://wa.me/3146905870">3146905870</a> - <a className="text-blue-600 hover:underline" href="https://wa.me/3138907119">3138907119</a></p>
          <p>Horario: lunes a viernes 7am–9pm; sábados, domingos y festivos 9am–4pm.</p>
        </div>
      </div>
    </section>
  );
}

