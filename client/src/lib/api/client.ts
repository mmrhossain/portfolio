import type { ApiError, ApiResponse } from "@/types";
import { useAuthStore } from "@/lib/auth/store";

export class ApiClientError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  revalidate?: number;
}

// Single-flight refresh: concurrent 401s wait for one refresh call instead of
// each firing their own, which prevents refresh storms and loops.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await res.json()) as ApiResponse<T> | ApiError)
    : null;

  if (!res.ok) {
    const errorPayload = payload as ApiError | null;
    throw new ApiClientError(
      res.status,
      errorPayload?.error?.code ?? "UNKNOWN_ERROR",
      errorPayload?.error?.message ??
        `Request failed with status ${res.status}`,
      errorPayload?.error?.details,
    );
  }

  return payload as ApiResponse<T>;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    // Cookie-based auth: always send the HttpOnly auth cookies.
    credentials = "include",
    revalidate,
  } = options;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    credentials,
    body: isFormData
      ? (body as FormData)
      : body
        ? JSON.stringify(body)
        : undefined,
    ...(revalidate ? { next: { revalidate } } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/v1${path}`, fetchOptions);
  } catch {
    throw new ApiClientError(
      0,
      "NETWORK_ERROR",
      "Unable to reach the server. Check your connection.",
    );
  }

  // Only attempt a refresh for an authenticated user hitting a protected route.
  // Skipping /auth/* prevents the refresh endpoint from triggering itself.
  const isLoggedIn =
    typeof window !== "undefined" && useAuthStore.getState().user !== null;

  if (res.status === 401 && !path.includes("/auth/") && isLoggedIn) {
    // A refresh is already in flight: wait for it, then retry once.
    if (isRefreshing) {
      await new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      const retryRes = await fetch(`${API_BASE}/api/v1${path}`, fetchOptions);
      return parseResponse<T>(retryRes);
    }

    isRefreshing = true;

    try {
      // The refresh endpoint reads the HttpOnly refreshToken cookie and sets a
      // new accessToken cookie. The browser handles the cookies automatically.
      const refreshRes = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!refreshRes.ok) {
        throw new Error("Session refresh failed");
      }

      isRefreshing = false;
      processQueue(null);

      // Retry the original request once with the refreshed cookie.
      const retryRes = await fetch(`${API_BASE}/api/v1${path}`, fetchOptions);
      return parseResponse<T>(retryRes);
    } catch (refreshError) {
      isRefreshing = false;
      processQueue(refreshError);

      // Refresh failed: clear UI auth state and send the user to login.
      useAuthStore.getState().reset();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      throw new ApiClientError(
        401,
        "UNAUTHORIZED",
        "Session expired. Please log in again.",
      );
    }
  }

  return parseResponse<T>(res);
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
