import { useEffect } from "react";
import { toast } from "sonner";

export function useAuthErrors() {
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    if (hash.includes("identity_already_exists")) {
      toast.error(
        "This Google account already exists. Please sign in instead.",
      );
    }

    window.history.replaceState({}, "", window.location.pathname);
  }, []);
}