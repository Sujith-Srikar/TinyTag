"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { NotFoundPage } from "@/components/Layout";

function LinkUnavailableContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const message =
    reason === "expired"
      ? "This link has expired."
      : "The page you're looking for doesn't exist.";

  return <NotFoundPage message={message} />;
}

export default function LinkUnavailablePage() {
  return (
    <Suspense>
      <LinkUnavailableContent />
    </Suspense>
  );
}
