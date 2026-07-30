import styles from "./Logo.module.scss";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 16 },
    md: { icon: 28, text: 18 },
    lg: { icon: 36, text: 24 },
  };

  const s = sizes[size];

  return (
    <div className={styles.logo}>
      
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="3"
          y="8"
          width="12"
          height="12"
          rx="6"
          stroke="var(--color-brand)"
          strokeWidth="2.4"
        />

        <rect
          x="13"
          y="8"
          width="12"
          height="12"
          rx="6"
          stroke="currentColor"
          strokeWidth="2.4"
        />
      </svg>

      <span className={styles.wordmark} style={{ fontSize: s.text }}>
        Tiny<span className={styles.accent}>Tag</span>
      </span>
    </div>
  );
}
