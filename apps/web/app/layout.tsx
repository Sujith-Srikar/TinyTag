import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "@/providers/Providers";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
    <html lang="en" suppressHydrationWarning className={geist.variable}>
      <body>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
