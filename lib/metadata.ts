import type { Metadata } from "next";

import { absoluteUrl, getSiteUrl } from "@/lib/site-url";

export const SITE_NAME = "JDU Showcase";

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  locale: string;
  path?: string;
  imageUrl?: string | null;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  locale,
  path = "",
  imageUrl,
  noIndex = false,
}: BuildPageMetadataOptions): Metadata {
  const normalizedPath = path.startsWith("/") ? path : path ? `/${path}` : "";
  const pageUrl = absoluteUrl(`/${locale}${normalizedPath}`);
  const ogImage =
    imageUrl && imageUrl.startsWith("http")
      ? imageUrl
      : imageUrl
        ? absoluteUrl(imageUrl)
        : absoluteUrl("/images/projects/project-screenshot-1.jpg");

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function getDefaultSiteMetadata(): Metadata {
  const siteUrl = getSiteUrl();

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${SITE_NAME} — Student Project Portfolio`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "Discover student projects, read comments, and share your portfolio work in Uzbek, English, Russian, and Japanese.",
    applicationName: SITE_NAME,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en",
      url: siteUrl,
      title: `${SITE_NAME} — Student Project Portfolio`,
      description:
        "Discover student projects, read comments, and share your portfolio work in Uzbek, English, Russian, and Japanese.",
      images: [
        {
          url: absoluteUrl("/images/projects/project-screenshot-1.jpg"),
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME} — Student Project Portfolio`,
      description:
        "Discover student projects, read comments, and share your portfolio work.",
      images: [absoluteUrl("/images/projects/project-screenshot-1.jpg")],
    },
  };
}
