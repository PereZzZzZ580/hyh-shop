export default function Devoluciones() {
  return (
    <section>
      <h1 className="text-3xl font-bold">Política de Devoluciones</h1>
      <div className="mt-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Tiempo para solicitar la devolución</h2>
          <p>El cliente podrá solicitar cambios o devoluciones hasta 5 días calendario después de recibir el producto.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Condiciones para aplicar</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>El producto debe estar en las mismas condiciones en que fue entregado: nuevo, sin uso, con etiquetas y empaque original.</li>
            <li>Aplica únicamente por defectos de fábrica o si el producto entregado no corresponde al solicitado.</li>
            <li>No se aceptan devoluciones por daños ocasionados por mal uso o desgaste normal.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Proceso en Armenia y Calarcá</h2>
          <p>El cliente puede coordinar con nuestro equipo logístico para la recogida del producto o entregarlo directamente en el punto acordado.</p>
          <p>Una vez recibido y revisado el producto, se ofrecerá cambio por otro artículo igual o equivalente. Si no es posible, se hará devolución del dinero.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Proceso en otros municipios</h2>
          <p>El cliente debe enviar el producto a través de una transportadora (costos de envío asumidos inicialmente por el cliente).</p>
          <p>Una vez recibido y verificado el estado del producto, se procederá con el cambio o devolución según corresponda.</p>
          <p>Si la devolución es aceptada, el costo de envío de retorno será reembolsado.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Excepciones</h2>
          <p>Por motivos de higiene y seguridad, algunos productos como ropa interior, cosméticos o artículos personalizados no tienen devolución, salvo por defectos de fabricación.</p>
        </div>
      </div>
    </section>
  );
}