export type Role = 'ADMIN' | 'USER';
export type ProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type MessageStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';
export type SkillCategory = 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'DEVOPS' | 'TOOLS' | 'OTHER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
  bio: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { blogs: number };
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconUrl: string;
  category: SkillCategory;
  proficiency: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string | null;
  image: string;
  repoUrl: string | null;
  liveUrl: string | null;
  tags: string[];
  featured: boolean;
  status: ProjectStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: number;
  author?: BlogAuthor;
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: MessageStatus;
  readAt: string | null;
  repliedAt: string | null;
  createdAt: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success?: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AuthResponse {
  user: User;
}

export interface DashboardSummary {
  counts: {
    users: number;
    projects: number;
    blogs: number;
    messages: number;
    unreadMessages: number;
    newUsersToday: number;
    publishedBlogs: number;
    featuredProjects: number;
  };
  recentMessages: Message[];
  recentBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    status: BlogStatus;
    publishedAt: string | null;
    createdAt: string;
  }>;
}

export interface AnalyticsOverview {
  total: number;
  visits: number;
  pageviews: number;
  timeline: Array<{ date: string; total: number }>;
  topPaths: Array<{ path: string; count: number }>;
}



export interface SkillFormValues {
    name: string;
    description: string;
    iconUrl: string;
    category: SkillCategory;
    proficiency: number;
    order: number;
}

export const initialSkillForm: SkillFormValues = {
    name: '',
    description: '',
    iconUrl: '',
    category: 'FRONTEND',
    proficiency: 80,
    order: 0,
};
