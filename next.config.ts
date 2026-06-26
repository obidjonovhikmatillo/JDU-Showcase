import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function getProductionHostname(): string | null {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.AUTH_URL?.trim();

  if (appUrl) {
    try {
      return new URL(appUrl).hostname;
    } catch {
      return null;
    }
  }

  return null;
}

const productionHostname = getProductionHostname();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
      },
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
      ...(productionHostname
        ? [
            {
              protocol: "https" as const,
              hostname: productionHostname,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
  turbopack: {
    root: projectRoot,
  },
};

export default withNextIntl(nextConfig);
