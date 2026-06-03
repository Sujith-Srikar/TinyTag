import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "@/providers/Providers";
import { Sidebar } from "@/components/Layout";
import { Geist } from "next/font/google";
import {Toaster} from 'sonner'

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "TinyTag — Link Intelligence",
    template: "%s | TinyTag",
  },
  description: "Shorten, track, and analyse every link you share.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Toaster position="top-center" />
          <div className="app-shell">
            <Sidebar />
            <main className="app-main">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
