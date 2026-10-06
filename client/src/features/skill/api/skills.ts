import { api } from '@/lib/api/client/client-fetch';
import { buildQuery } from '@/lib/api/query';
import type { Skill, SkillCategory } from '@/types';

export interface SkillPayload {
  name: string;
  description: string;
  iconUrl: string;
  category: SkillCategory;
  proficiency: number;
  order?: number;
}

export interface SkillListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export const skillsApi = {
  list: (params: SkillListParams = {}) =>
    api.get<Skill[]>(buildQuery('/skills', params)),
  get: (id: string) => api.get<Skill>(`/skills/${id}`),
  create: (payload: SkillPayload) => api.post<Skill>('/skills', payload),
  update: (id: string, payload: Partial<SkillPayload>) =>
    api.patch<Skill>(`/skills/${id}`, payload),
  delete: (id: string) => api.delete<null>(`/skills/${id}`),
};
