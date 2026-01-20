import { Metadata } from "next";

export const siteConfig = {
  name: "InstaD",
  domain: "instad.pastex.online",
  shortName: "InstaD",
  creator: "Aniket_kumar",
  description:
    "Fast, free, instagram video downloader and no login required. Just paste the URL and download.",
  ogDescription:
    "Fast, free, instagram video downloader and no login required. Just paste the URL and download.",
  url: "https://instad.pastex.online",
};

export const siteMetadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.ogDescription,
    creator: siteConfig.creator,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/Instagram_logo.png",
  },
  manifest: "/web.manifest.json",
};
