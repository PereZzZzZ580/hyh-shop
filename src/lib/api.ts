"use client";

import useSWR from "swr";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const INTERNAL_API_BASE = "/api";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
  } catch (err: any) {
    throw new Error("No se pudo conectar con la API");
  }
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error al llamar a la API");
  }
  return res.json() as Promise<T>;
}

export async function apiFetchAuth<T>(
  path: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  let res: Response;
  try {
    res = await fetch(`${INTERNAL_API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
  } catch (err: any) {
    throw new Error("No se pudo conectar con el servidor");
  }
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Error al llamar a la API");
  }
  return res.json() as Promise<T>;
}

export function useApi<T>(path: string) {
  const fetcher = () => apiFetch<T>(path);
  const { data, error, isLoading, mutate } = useSWR<T>(path, fetcher);
  return { data, error, isLoading, mutate };
}

export function useApiAuth<T>(path: string) {
  const fetcher = () => apiFetchAuth<T>(path);
  const { data, error, isLoading, mutate } = useSWR<T>(path, fetcher);
  return { data, error, isLoading, mutate };
}
