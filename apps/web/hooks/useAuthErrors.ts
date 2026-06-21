import { useEffect } from "react";
import { toast } from "sonner";

export function useAuthErrors() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const error = params.get("error");

    if (!error) return;

    const AUTH_ERRORS: Record<string, string> = {
      identity_already_exists:
        "This Google account is already linked to another account.",

      access_denied: "Sign in was cancelled.",

      server_error: "Authentication service is temporarily unavailable.",
    };

    toast.error(AUTH_ERRORS[error] ?? "Unable to sign in.");

    window.history.replaceState({}, "", window.location.pathname);
  }, []);
}
