import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { WarmBackground } from "@/components/shared/WarmBackground";
import { LanguageProvider } from "@/lib/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yorisoi AI (寄り添いAI) | Eldercare Intelligence Platform",
  description:
    "Connecting care, AI that stays by your side. A unified multi-agent system for eldercare coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f3e4ce] text-stone-900">
        <LanguageProvider>
          <div className="relative isolate min-h-screen overflow-x-hidden">
            <WarmBackground />
            <div className="relative z-10">{children}</div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
