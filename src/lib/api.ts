"use client";

import useSWR from "swr";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const isFormData = options.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });
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