import type { ReactNode } from "react";
import styles from "./TopBar.module.scss";

interface TopBarProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}

export function TopBar({ title, subtitle, actions, breadcrumb }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        {breadcrumb && <div className={styles.breadcrumb}>{breadcrumb}</div>}
        <div className={styles.titles}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
