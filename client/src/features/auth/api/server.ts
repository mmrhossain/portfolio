import type { ApiResponse, User } from "@/types";
import { serverFetch } from "@/lib/api/server/server-fetch";

export async function getMe() {
  try {
    const response: ApiResponse<User> = await serverFetch("/auth/me");
    return response?.data;
  } catch {
    return undefined;
  }
}
