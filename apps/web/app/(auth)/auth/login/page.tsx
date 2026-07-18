"use client";

import { Button } from "@repo/ui";
import { createClient } from "@/utils/auth/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/UI";
import styles from "./page.module.scss";
import { Globe, User } from "lucide-react";
import { toast } from "sonner";
const supabase = createClient();

function Login() {
  const router = useRouter();

  const handleSigninWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error("Unable to sign in");
      return;
    }
    router.refresh();
  };

  const handleSigninAnonymous = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      toast.error("Unable to sign in");
      return;
    }
    router.refresh();
  };

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Logo size="lg" />
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>Shorten. Share. Track.</h1>

          <p className={styles.description}>
            Create short links, organize them from one dashboard, and track
            every click without the clutter.
          </p>

          <div className={styles.actions}>
            <Button
              onClick={handleSigninWithGoogle}
              className={styles.googleButton}
            >
              <Globe size={18} />
              Continue with Google
            </Button>

            <Button
              variant="outline"
              onClick={handleSigninAnonymous}
              className={styles.guestButton}
            >
              <User size={18} />
              Continue as Guest
            </Button>
          </div>

          <div className={styles.features}>
            <div>
              <span className={styles.dot} />
              Upgrade to Google later
            </div>

            <div>
              <span className={styles.dot} />
              Keep all your links
            </div>

            <div>
              <span className={styles.dot} />
              No setup required
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
