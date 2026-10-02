/** Default ISR interval for public CMS-backed pages (1 hour). */
export const REVALIDATE_PUBLIC = 3600;

/** Settings change less often than lists but should stay reasonably fresh. */
export const REVALIDATE_SETTINGS = 600;

export const CACHE_TAGS = {
  projects: 'projects',
  blogs: 'blogs',
  skills: 'skills',
  experience: 'experience',
  education: 'education',
  settings: 'settings',
} as const;
