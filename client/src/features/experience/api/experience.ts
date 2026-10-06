import { api } from '@/lib/api/client/client-fetch';
import { buildQuery } from '@/lib/api/query';
import type { Experience } from '@/types';
import type { RichTextValue } from '@/lib/rich-text';

export interface ExperiencePayload {
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description: RichTextValue;
  order?: number;
  isActive?: boolean;
}

export interface ExperienceListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const experienceApi = {
  list: (params: ExperienceListParams = {}) =>
    api.get<Experience[]>(buildQuery('/experience', params)),
  get: (id: string) => api.get<Experience>(`/experience/${id}`),
  create: (payload: ExperiencePayload) =>
    api.post<Experience>('/experience', payload),
  update: (id: string, payload: Partial<ExperiencePayload>) =>
    api.patch<Experience>(`/experience/${id}`, payload),
  delete: (id: string) => api.delete<null>(`/experience/${id}`),
};
