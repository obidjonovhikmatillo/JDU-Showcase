import "./globals.css";

import { getDefaultSiteMetadata } from "@/lib/metadata";

export const metadata = getDefaultSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
