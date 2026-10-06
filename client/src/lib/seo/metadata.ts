import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  PERSON_NAME,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  LOCALE,
} from "./config";

type OgType = "website" | "article";

export interface CreatePageMetadataInput {
  title: string;
  description?: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: OgType;
  index?: boolean;
  follow?: boolean;
  keywords?: string[];
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  absoluteTitle?: boolean;
}

export const noIndexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  imageAlt,
  type = "website",
  index = true,
  follow = true,
  keywords,
  publishedTime,
  modifiedTime,
  authors,
  absoluteTitle = false,
}: CreatePageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image || DEFAULT_OG_IMAGE;
  const displayTitle = absoluteTitle ? title : `${title} | ${PERSON_NAME}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    authors: authors?.map((name) => ({ name })),
    alternates: {
      canonical: url,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type,
      locale: LOCALE,
      siteName: SITE_NAME,
      title: displayTitle,
      description,
      url,
      images: [
        {
          url: ogImage,
          alt: imageAlt || title,
          width: 1200,
          height: 630,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
            authors,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [ogImage],
    },
    metadataBase: new URL(SITE_URL),
  };
}
