import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Oxanium } from "next/font/google";
import "./globals.css";

const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono" });
const heading = Oxanium({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "ONE:ACCESS",
  description: "Un projet de référentiel pour mesurer les écarts réels d’accessibilité entre les parcours.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`dark h-full antialiased ${sans.variable} ${mono.variable} ${heading.variable}`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
