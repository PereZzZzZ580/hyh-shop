"use client";

import { useAuth } from "@/store/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const token = useAuth.getState().token;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error al llamar a la API");
  }
  return res.json() as Promise<T>;
}