import type { Metadata } from "next";
import "./globals.scss";
import { Providers } from "@/providers/Providers";
import { Toaster } from "sonner";
import localfont from "next/font/local";

const satoshi = localfont({
  src: "../public/fonts/Satoshi-Variable.ttf",
  variable: "--font-body",
  display: "swap",
});

const ppNeueMontreal = localfont({
  src: "../public/fonts/PPNeueMontreal-Regular.ttf",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TinyTag — Link Intelligence",
    template: "%s | TinyTag",
  },
  description: "Shorten, track, and analyse every link you share.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${satoshi.variable} ${ppNeueMontreal.variable}`}
    >
      <body>
        <Providers>
          <Toaster position="top-center" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
