export default function Cookies() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Política de Cookies</h1>

      <h2 className="text-xl font-semibold">1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos que se guardan en tu navegador cuando
        visitas un sitio web. Sirven para recordar tus preferencias, mejorar tu
        experiencia de navegación y ayudarnos a entender cómo usas nuestra tienda
        en línea.
      </p>

      <h2 className="text-xl font-semibold">2. ¿Qué tipos de cookies usamos?</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Cookies necesarias:</strong> permiten el funcionamiento básico
          del sitio (ejemplo: mantener el carrito de compras activo).
        </li>
        <li>
          <strong>Cookies de preferencias:</strong> recuerdan tus elecciones,
          como idioma o ubicación.
        </li>
        <li>
          <strong>Cookies de análisis:</strong> nos ayudan a entender cómo navegan
          los usuarios para mejorar la tienda (ejemplo: Google Analytics, si lo
          activas).
        </li>
        <li>
          <strong>Cookies de terceros (opcional):</strong> pueden usarse si
          integras servicios externos como pasarelas de pago, redes sociales o
          plataformas de marketing.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">3. ¿Para qué usamos las cookies?</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Guardar los productos que agregas al carrito.</li>
        <li>Recordar tu sesión como cliente registrado.</li>
        <li>Mejorar tiempos de carga y rendimiento del sitio.</li>
        <li>
          Analizar tráfico y uso de la página para optimizar la experiencia.
        </li>
      </ul>

      <h2 className="text-xl font-semibold">4. ¿Cómo puedes gestionar las cookies?</h2>
      <p>
        Puedes aceptar o rechazar el uso de cookies no esenciales. También puedes
        configurar tu navegador para bloquearlas, eliminarlas o recibir alertas
        cuando se instalen. Ten en cuenta que si desactivas las cookies necesarias,
        algunas funciones del sitio pueden no funcionar correctamente.
      </p>

      <h2 className="text-xl font-semibold">5. Cambios en la política</h2>
      <p>
        Podemos actualizar esta Política de Cookies en cualquier momento.
        Publicaremos la nueva versión con fecha visible en esta página.
      </p>

      <h2 className="text-xl font-semibold">6. Contacto</h2>
      <p>
        Si tienes dudas sobre esta política o el uso de cookies, puedes
        escribirnos a:
      </p>
      <p>
        Correo: {" "}
        <a
          href="mailto:hyhbarbershop@gmail.com"
          className="text-blue-600 hover:underline"
        >
          hyhbarbershop@gmail.com
        </a>
      </p>
      <p>
        WhatsApp: {" "}
        <a
          href="https://wa.me/3146905870"
          className="text-blue-600 hover:underline"
        >
          3146905870
        </a>{" "}-{" "}
        <a
          href="https://wa.me/3138907119"
          className="text-blue-600 hover:underline"
        >
          3138907119
        </a>
      </p>
    </section>
  );
}