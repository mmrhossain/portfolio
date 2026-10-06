export {
  SITE_URL,
  SITE_NAME,
  PERSON_NAME,
  PERSON_JOB_TITLE,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TITLE_TEMPLATE,
  SOCIAL_PROFILES,
  KNOWS_ABOUT,
  EMAIL,
  PHONE,
  LANGUAGE,
  LOCALE,
  absoluteUrl,
} from "./config";

export { createPageMetadata, noIndexRobots } from "./metadata";
export {
  serializeJsonLd,
  personJsonLd,
  websiteJsonLd,
  siteGraphJsonLd,
  breadcrumbJsonLd,
  projectJsonLd,
  articleJsonLd,
} from "./json-ld";
