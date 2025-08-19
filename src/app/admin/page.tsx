export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Administración</h1>
      <ul className="list-disc pl-6">
        <li>
          <a href="/admin/products" className="text-blue-600 hover:underline">
            Productos
          </a>
        </li>
      </ul>
    </div>
  );
}