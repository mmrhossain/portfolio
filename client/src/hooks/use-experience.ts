'use client';

import { useQuery } from '@tanstack/react-query';
import { experienceApi } from '@/lib/api/experience';

export function useExperience() {
  return useQuery({
    queryKey: ['experience'],
    queryFn: () => experienceApi.list({ limit: 100 }),
  });
}

export function useAdminExperience() {
  return useQuery({
    queryKey: ['experience', 'admin'],
    queryFn: () => experienceApi.list({ limit: 100 }),
  });
}
