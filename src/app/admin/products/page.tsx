export default function AdminProductsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>
      <a
        href="/admin/products/new"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Nuevo producto
      </a>
    </div>
  );
}