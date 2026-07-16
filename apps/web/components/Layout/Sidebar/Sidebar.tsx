"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/UI";
import styles from "./Sidebar.module.scss";
import { LayoutDashboard, BarChart3, Settings, LogOut, Sun, Moon, UserPlus } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { User } from "@repo/shared";
import { createClient } from "@/utils/auth/client";
import { useAuthErrors } from "@/hooks/useAuthErrors";
import { useTheme } from "next-themes";
import { toast } from "sonner";
const supabase = createClient();

const NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    href: "/analytics",
    label: "Analytics",
    icon: <BarChart3 />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const trpc = useTRPC();
  const { data, error } = useQuery(trpc.get.getMe.queryOptions());

  useAuthErrors();

  const handleLogOut = async () => {
    setMenuOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout Failed");
      return;
    }
    toast.success("Logout Successful");
    router.refresh();
  };

  const handleUpgradeAcc = async () => {
    setMenuOpen(false);
    const { data, error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });

    if (error || !data.url) return;

    window.location.assign(data.url);
  };

  useEffect(() => {
    if (error || !data) return;
    setUser(data);
  }, [data]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

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
          <line x1="2" y1="4.5" x2="16" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="13.5" x2="16" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Footer — user row + popover menu */}
        <div className={styles.footer} ref={menuRef}>
          {/* User menu popover */}
          <div
            className={[styles.userMenu, menuOpen ? styles.menuOpen : ""]
              .filter(Boolean)
              .join(" ")}
            role="menu"
          >
            <button
              className={styles.menuItem}
              role="menuitem"
              onClick={() => {
                setTheme(isDark ? "light" : "dark");
                setMenuOpen(false);
              }}
            >
              {isDark ? <Sun /> : <Moon />}
              {isDark ? "Light mode" : "Dark mode"}
            </button>

            {user?.isAnonymous && (
              <button
                className={styles.menuItem}
                role="menuitem"
                onClick={handleUpgradeAcc}
              >
                <UserPlus />
                Upgrade with Google
              </button>
            )}

            <div className={styles.menuDivider} />

            <button
              className={[styles.menuItem, styles.menuItemDanger]
                .filter(Boolean)
                .join(" ")}
              role="menuitem"
              onClick={handleLogOut}
            >
              <LogOut />
              Logout
            </button>
          </div>

          {/* User row */}
          <div
            className={[styles.userRow, collapsed ? styles.userRowCollapsed : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => setMenuOpen((o) => !o)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMenuOpen((o) => !o);
              }
            }}
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            <div className={styles.avatar} title="User account">
              <span>
                {user?.isAnonymous
                  ? "G"
                  : (user?.email?.charAt(0).toUpperCase() ?? "U")}
              </span>
            </div>

            {!collapsed && (
              <div className={styles.userInfo}>
                <span className={styles.userName}>
                  {user?.isAnonymous ? "Guest User" : user?.email}
                </span>
                <span className={styles.userPlan}>
                  {user?.isAnonymous ? "Anonymous Session" : "Free Plan"}
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
