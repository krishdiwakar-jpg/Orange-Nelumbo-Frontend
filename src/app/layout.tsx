import type { Metadata, Viewport } from "next";

import { AppProvider } from "@/components/providers/app-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Orange Nelumbo | Adaptive JEE preparation",
    template: "%s | Orange Nelumbo",
  },
  description:
    "A precise, adaptive JEE preparation platform for learning, simulation, practice, mocks, and rank improvement.",
  keywords: ["JEE preparation", "JEE Main", "JEE Advanced", "adaptive learning", "mock tests"],
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0E0D10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
