import type { ReactNode } from "react";
import styles from "./ModalParts.module.scss";

interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose: () => void;
  icon?: ReactNode;
  iconVariant?: "default" | "danger" | "warning" | "success";
}

export function ModalHeader({
  title,
  description,
  onClose,
  icon,
  iconVariant = "default",
}: ModalHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        {icon && (
          <div
            className={[
              styles.iconRing,
              styles[`iconRing-${iconVariant}`],
            ].join(" ")}
          >
            {icon}
          </div>
        )}
        <div className={styles.titles}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>

      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close modal"
        type="button"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
  return (
    <div className={[styles.body, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

interface ModalFooterProps {
  children: ReactNode;
  bordered?: boolean;
}

export function ModalFooter({ children, bordered = true }: ModalFooterProps) {
  return (
    <div
      className={[styles.footer, bordered ? styles.footerBordered : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}

export function FieldGroup({ children }: { children: ReactNode }) {
  return <div className={styles.fieldGroup}>{children}</div>;
}

export function ModalDivider() {
  return <hr className={styles.divider} />;
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.5 1.5L12.5 12.5M12.5 1.5L1.5 12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DrawerHandle() {
  return (
    <div className={styles.drawerHandleWrap} aria-hidden="true">
      <div className={styles.drawerHandle} />
    </div>
  );
}