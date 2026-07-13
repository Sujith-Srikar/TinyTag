import Link from "next/link";
import { Button } from "@repo/ui";

export default function LinkExpiredPage() {
  return (
    <main className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-sm text-white/60">This link has expired.</p>
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </main>
  );
}
