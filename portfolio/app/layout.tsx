import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import SiteNav from "@/components/SiteNav";
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
  title: {
    template: "%s — Xiaoqian Zhai",
    default: "Xiaoqian Zhai — Portfolio",
  },
  description:
    "Portfolio of Xiaoqian Zhai, MSBA candidate at Santa Clara University.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-black/10 dark:border-white/15">
          <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">
              Xiaoqian Zhai
            </Link>
            <SiteNav />
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          {children}
        </main>
        <footer className="border-t border-black/10 dark:border-white/15">
          <div className="mx-auto w-full max-w-3xl px-6 py-6 text-sm text-foreground/60">
            © 2026 Xiaoqian Zhai
          </div>
        </footer>
      </body>
    </html>
  );
}
