import type { Metadata } from "next";
import { siteConfig } from "./config";

export function buildMetadata({
  title,
  description,
  canonicalPath,
  publishedTime,
  tags,
}: {
  title: string;
  description?: string;
  canonicalPath: string;
  publishedTime?: string;
  tags?: string[];
}): Metadata {
  const canonicalUrl = `${siteConfig.url}${canonicalPath}`;
  // Only include ogImage if the file actually exists (checked separately)
  const ogImageUrl = siteConfig.ogImage ? `${siteConfig.url}${siteConfig.ogImage}` : undefined;

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: description || undefined,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: publishedTime ? "article" : "website",
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags && tags.length > 0 ? { tags } : {}),
      ...(ogImageUrl ? { images: [{ url: ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || undefined,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  };
}

export function buildArticleJsonLd({
  title,
  description,
  canonicalPath,
  publishedTime,
}: {
  title: string;
  description?: string;
  canonicalPath: string;
  publishedTime?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description ? { description } : {}),
    url: `${siteConfig.url}${canonicalPath}`,
    author: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    ...(publishedTime ? { datePublished: publishedTime } : {}),
  };
}

export function buildSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}
