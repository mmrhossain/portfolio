import { api } from '@/lib/api/client/client-fetch';
import { buildQuery } from '@/lib/api/query';
import type { Message, MessageStatus } from '@/types';

export interface MessagePayload {
  name: string;
  email: string;
  subject?: string;
  body: string;
}

export const messagesApi = {
  send: (payload: MessagePayload) => api.post<Message>('/messages', payload),
  list: (
    params: {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
    } = {},
  ) => api.get<Message[]>(buildQuery('/messages', params)),
  get: (id: string) => api.get<Message>(`/messages/${id}`),
  updateStatus: (id: string, status: MessageStatus) =>
    api.patch<Message>(`/messages/${id}`, { status }),
  delete: (id: string) => api.delete<null>(`/messages/${id}`),
  stats: () =>
    api.get<{
      total: number;
      unread: number;
      read: number;
      replied: number;
      archived: number;
      recent: Message[];
    }>('/messages/stats'),
};
