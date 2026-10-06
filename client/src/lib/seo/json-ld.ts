import {
  DEFAULT_DESCRIPTION,
  EMAIL,
  KNOWS_ABOUT,
  PERSON_IMAGE_PATH,
  PERSON_JOB_TITLE,
  PERSON_NAME,
  PHONE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  absoluteUrl,
} from "./config";
import type { Blog, Project } from "@/types";
import { extractRichText } from "@/lib/rich-text";

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}#person`,
    name: PERSON_NAME,
    jobTitle: PERSON_JOB_TITLE,
    url: SITE_URL,
    image: absoluteUrl(PERSON_IMAGE_PATH),
    email: EMAIL,
    telephone: PHONE,
    address: {
      "@type": "PostalAddress",
      addressCountry: "BD",
    },
    sameAs: [...SOCIAL_PROFILES],
    knowsAbout: [...KNOWS_ABOUT],
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${SITE_URL}#person` },
    author: { "@id": `${SITE_URL}#person` },
  };
}

export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [personJsonLd(), websiteJsonLd()],
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function projectJsonLd(project: Project, slug: string) {
  const sameAs = [project.liveUrl, project.repoUrl].filter(
    (value): value is string => Boolean(value),
  );

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: extractRichText(project.description),
    image: project.image || undefined,
    url: absoluteUrl(`/projects/${slug}`),
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    keywords: project.tags,
    author: { "@id": `${SITE_URL}#person` },
    creator: { "@id": `${SITE_URL}#person` },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleJsonLd(blog: Blog, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage,
    datePublished: blog.publishedAt ?? undefined,
    dateModified: blog.updatedAt,
    author: {
      "@type": "Person",
      name: blog.author?.name ?? PERSON_NAME,
      url: SITE_URL,
    },
    publisher: { "@id": `${SITE_URL}#person` },
    mainEntityOfPage: absoluteUrl(`/blogs/${slug}`),
    url: absoluteUrl(`/blogs/${slug}`),
    articleSection: blog.category,
    keywords: blog.tags,
    ...(blog.readTime ? { timeRequired: `PT${blog.readTime}M` } : {}),
  };
}
