import { cookies } from "next/headers";

import type { ApiResponse, PaginationMeta } from "@/types";
import { REVALIDATE_PUBLIC } from "@/constants/cache";

const API_BASE = process.env.API_URL ?? "http://localhost:4000";

interface ServerFetchOptions {
  revalidate?: number | false;
  tags?: string[];
}

export interface PaginatedResult<T> {
  data: T[];
  meta?: PaginationMeta;
}

export async function serverFetchRaw<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T> | null> {
  const revalidate = options.revalidate ?? REVALIDATE_PUBLIC;

  try {
    const res = await fetch(`${API_BASE}/api/v1${path}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...(revalidate === false
        ? {
            cache: "no-store",
          }
        : {
            next: {
              revalidate,
              tags: options.tags,
            },
          }),
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as ApiResponse<T>;
  } catch {
    return null;
  }
}

export async function serverFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const cookieHeader = [
    accessToken && `accessToken=${accessToken}`,
    refreshToken && `refreshToken=${refreshToken}`,
  ]
    .filter(Boolean)
    .join("; ");

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const payload = await res.json();

  return payload;
}
