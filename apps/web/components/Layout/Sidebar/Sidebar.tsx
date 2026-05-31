"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, ThemeToggle } from "@/components/UI";
import styles from "./Sidebar.module.scss";
import { LayoutDashboard, ChartNoAxesCombined, Wrench } from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <ChartNoAxesCombined />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Wrench />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile hamburger */}
      <button
        className={styles.mobileToggle}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle sidebar"
      >
        <svg viewBox="0 0 18 18" fill="none">
          <line
            x1="2"
            y1="4.5"
            x2="16"
            y2="4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="9"
            x2="16"
            y2="9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="13.5"
            x2="16"
            y2="13.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <aside
        className={[
          styles.sidebar,
          collapsed ? styles.collapsed : "",
          mobileOpen ? styles.mobileOpen : "",
        ]
          .filter(Boolean)
          .join(" ")}
        data-collapsed={collapsed}
      >
        {/* Header */}
        <div className={styles.header}>
          <Link
            href="/"
            className={styles.logoLink}
            onClick={() => setMobileOpen(false)}
          >
            <Logo collapsed={collapsed} size="md" />
          </Link>

          <button
            className={styles.collapseBtn}
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              style={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[styles.navItem, isActive ? styles.active : ""]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    {!collapsed && (
                      <span className={styles.navLabel}>{item.label}</span>
                    )}
                    {isActive && (
                      <span className={styles.activePip} aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Footer */}
        <div className={styles.footer}>
          <ThemeToggle showLabel={!collapsed} collapsed={collapsed} />

          {/* User avatar placeholder */}
          <div
            className={[
              styles.userRow,
              collapsed ? styles.userRowCollapsed : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className={styles.avatar} title="User account">
              <span>U</span>
            </div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>user@example.com</span>
                <span className={styles.userPlan}>Free Plan</span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
