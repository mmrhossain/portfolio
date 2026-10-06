import { api } from '@/lib/api/client/client-fetch';
import { buildQuery } from '@/lib/api/query';
import type { User } from '@/types';

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export interface UserUpdatePayload {
  name?: string;
  bio?: string;
  avatarUrl?: string | null;
  role?: 'ADMIN' | 'USER';
  isActive?: boolean;
}

export const usersApi = {
  list: (params: UserListParams = {}) =>
    api.get<User[]>(buildQuery('/users', params)),
  update: (id: string, payload: UserUpdatePayload) =>
    api.patch<User>(`/users/${id}`, payload),
  updateProfile: (payload: {
    name?: string;
    bio?: string;
    avatarUrl?: string | null;
  }) => api.patch<User>('/users/profile', payload),
  delete: (id: string) => api.delete<null>(`/users/${id}`),
  stats: () =>
    api.get<{ total: number; active: number; inactive: number; admins: number }>(
      '/users/stats',
    ),
};
