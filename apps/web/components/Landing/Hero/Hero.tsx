"use client"

import { ArrowRight } from "lucide-react";
import { Badge, Button } from "@repo/ui";
import styles from "./Hero.module.scss";
import { useRouter } from "next/navigation";

export function Hero() {

  const router = useRouter();

  const handleClick = () => {
    router.push('/auth/login');
  }

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <Badge variant="outline" className={styles.badge}>
          <span className={styles.dot} />
          Free forever • Open source
        </Badge>

        <h1 className={styles.title}>
          <span className={styles.tiny}>Tiny</span>
          <span className={styles.tags}>Tags</span>
        </h1>

        <p className={styles.subtitle}>
          Shorten, protect, and track every link you share.
          Custom slugs, QR codes, analytics, and more — all in one place.
        </p>

        <div className={styles.ctaRow}>
          <Button size="lg" className={styles.cta} onClick={handleClick}>
            Get Started
            <ArrowRight className={styles.arrow} />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className={styles.ctaSecondary}
            onClick={handleClick}
          >
            Learn more
          </Button>
        </div>
      </div>
    </section>
  );
}