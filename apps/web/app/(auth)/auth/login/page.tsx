"use client";

import { Button } from "@repo/ui";
import { createClient } from "@/utils/auth/client";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/UI";
import styles from "./page.module.scss";
import { ArrowRight, Globe, User } from "lucide-react";
const supabase = createClient();

function Login() {
  const router = useRouter();

  const handleSigninWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return;
    router.refresh();
  };

  const handleSigninAnonymous = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) return;
    router.refresh();
  };

  return (
    <main className={styles.page}>
      <div className={styles.glow} />

      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <Logo size="lg" />
        </div>

        <div className={styles.content}>
          <div className={styles.badge}>TinyTags</div>

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
              <ArrowRight size={14} />
              Upgrade to Google later
            </div>

            <div>
              <ArrowRight size={14} />
              Keep all your links
            </div>

            <div>
              <ArrowRight size={14} />
              No setup required
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
