import { api } from './client';
import { buildQuery } from './query';
import type { Education } from '@/types';

export interface EducationPayload {
  institution: string;
  degree: string;
  field?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: string;
  order?: number;
  isActive?: boolean;
}

export interface EducationListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const educationApi = {
  list: (params: EducationListParams = {}) =>
    api.get<Education[]>(buildQuery('/education', params)),
  get: (id: string) => api.get<Education>(`/education/${id}`),
  create: (payload: EducationPayload) =>
    api.post<Education>('/education', payload),
  update: (id: string, payload: Partial<EducationPayload>) =>
    api.patch<Education>(`/education/${id}`, payload),
  delete: (id: string) => api.delete<null>(`/education/${id}`),
};
