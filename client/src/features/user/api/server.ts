import type { ApiResponse, PaginationMeta, User } from "@/types";
import { serverFetch } from "@/lib/api/server/server-fetch";

export async function serverListUsers() {
  const response: ApiResponse<User[]> = await serverFetch("/users");
  return {
    data: response?.data ?? [],
    meta: response?.meta as PaginationMeta | undefined,
  };
}
