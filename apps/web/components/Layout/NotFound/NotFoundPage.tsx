"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import { Button } from "@repo/ui";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
});

export function NotFoundPage({ message }: { message?: string } = {}) {
  return (
    <main className="fixed inset-0 bg-black z-[9999]">
      <Scene />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end gap-4 pb-16">
        <p className="text-sm text-white/60">
          {message ?? "The page you're looking for doesn't exist."}
        </p>

        <div className="pointer-events-auto">
          <Button asChild>
            <Link href="/dashboard">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}