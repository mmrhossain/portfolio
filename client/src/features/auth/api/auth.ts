import { api } from "@/lib/api/client/client-fetch";
import type { AuthResponse, User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<AuthResponse>("/auth/login", payload),
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>("/auth/register", payload),
  me: () => api.get<User>("/auth/me"),
  refresh: () => api.post<AuthResponse>("/auth/refresh", {}),
  logout: () => api.post<null>("/auth/logout", {}),
  logoutAll: () => api.post<null>("/auth/logout-all", {}),
  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    api.post<null>("/auth/change-password", payload),
  forgotPassword: (payload: { email: string }) =>
    api.post<null>("/auth/forgot-password", payload),
  resetPassword: (payload: { token: string; password: string }) =>
    api.post<null>("/auth/reset-password", payload),
};
