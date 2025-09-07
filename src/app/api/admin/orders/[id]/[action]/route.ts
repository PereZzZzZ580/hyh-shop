import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; action: string } }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { error: "No autenticado" },
      { status: 401 }
    );
  }

  const { id, action } = params;
  const allowed = new Set(["pending", "fulfill", "cancel", "refund", "pay"]);
  if (!allowed.has(action)) {
    return NextResponse.json({ error: "Acción no soportada" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/admin/orders/${id}/${action}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "No se pudo contactar el backend" },
      { status: 502 }
    );
  }
}
