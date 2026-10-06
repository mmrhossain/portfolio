export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mmrhossain.com"
).replace(/\/$/, "");

export const PERSON_NAME = "Monir Hossain";
export const PERSON_JOB_TITLE = "Full Stack Developer";
export const SITE_NAME = `${PERSON_NAME} - ${PERSON_JOB_TITLE}`;
export const TITLE_TEMPLATE = `%s | ${PERSON_NAME}`;

export const DEFAULT_DESCRIPTION =
  "Monir Hossain is a full stack developer in Bangladesh who builds web applications with React, Next.js, Node.js, Express.js, TypeScript, PostgreSQL, and Prisma.";

export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dw0ojh7h8/image/upload/v1788488505/seo-image_p2ftyo.webp";

export const PERSON_IMAGE_PATH = "/images/default/portfolio.webp";

export const EMAIL = "info.mmrhossain@gmail.com";
export const PHONE = "+8801787960556";
export const LOCALE = "en_US";
export const LANGUAGE = "en";

export const SOCIAL_PROFILES = [
  "https://github.com/md-mhossain",
  "https://linkedin.com/in/md-mhossain",
  "https://github.com/mmrhossain",
  "https://www.linkedin.com/in/mmrhossain",
  "https://facebook.com/MonirHossain20230",
  "https://wa.me/8801787960556",
] as const;

export const KNOWS_ABOUT = [
  "Full Stack Development",
  "React",
  "Next.js",
  "Node.js",
  "Express.js",
  "TypeScript",
  "PostgreSQL",
  "Prisma",
  "E-commerce development",
] as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}
