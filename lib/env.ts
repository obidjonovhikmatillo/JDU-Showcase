import "server-only";

import { getSiteUrl } from "@/lib/site-url";

type EnvIssue = {
  key: string;
  message: string;
  severity: "error" | "warning";
};

export function getProductionEnvIssues(): EnvIssue[] {
  const issues: EnvIssue[] = [];

  if (!process.env.DATABASE_URL?.trim()) {
    issues.push({
      key: "DATABASE_URL",
      message: "PostgreSQL connection string is required.",
      severity: "error",
    });
  }

  if (!process.env.AUTH_SECRET?.trim()) {
    issues.push({
      key: "AUTH_SECRET",
      message: "Auth.js secret is required (openssl rand -base64 32).",
      severity: "error",
    });
  }

  const appUrl = getSiteUrl();
  if (process.env.NODE_ENV === "production" && appUrl.includes("localhost")) {
    issues.push({
      key: "NEXT_PUBLIC_APP_URL",
      message: "Set your production URL (e.g. https://your-app.vercel.app).",
      severity: "error",
    });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const cloudKey = process.env.CLOUDINARY_API_KEY?.trim();
  const cloudSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  const cloudinaryConfigured = Boolean(cloudName && cloudKey && cloudSecret);

  if (process.env.NODE_ENV === "production" && !cloudinaryConfigured) {
    issues.push({
      key: "CLOUDINARY_*",
      message: "Cloudinary is required in production for image uploads.",
      severity: "warning",
    });
  }

  if (
    process.env.DATABASE_URL?.includes("neon.tech") ||
    process.env.DATABASE_URL?.includes("pooler")
  ) {
    if (!process.env.DIRECT_URL?.trim()) {
      issues.push({
        key: "DIRECT_URL",
        message: "Set DIRECT_URL for Neon/Supabase pooled connections when running migrations.",
        severity: "warning",
      });
    }
  }

  return issues;
}

export function assertProductionEnv(): void {
  const errors = getProductionEnvIssues().filter((issue) => issue.severity === "error");

  if (errors.length === 0) {
    return;
  }

  const message = errors.map((issue) => `${issue.key}: ${issue.message}`).join("\n");
  throw new Error(`Missing required environment variables:\n${message}`);
}
