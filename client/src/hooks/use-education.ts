'use client';

import { useQuery } from '@tanstack/react-query';
import { educationApi } from '@/lib/api/education';

export function useEducation() {
  return useQuery({
    queryKey: ['education'],
    queryFn: () => educationApi.list({ limit: 100 }),
  });
}

export function useAdminEducation() {
  return useQuery({
    queryKey: ['education', 'admin'],
    queryFn: () => educationApi.list({ limit: 100 }),
  });
}
