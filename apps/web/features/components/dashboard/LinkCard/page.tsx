"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Copy } from "lucide-react";
import { Badge, Button } from "@repo/ui";
import {
  getDomain,
  formatNumber,
  formatDate,
  getFaviconUrl,
} from "@/utils/mock-data";
import { type LinkRecord } from "@repo/shared";
import styles from "./page.module.scss";

interface LinkCardProps {
  link: LinkRecord;
  index?: number;
  onEdit?: (link: LinkRecord) => void;
  onDelete?: (link: LinkRecord) => void;
}

const BASE_URL = "ttags.vercel.app";

export function LinkCard({ link, index = 0, onEdit, onDelete }: LinkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shortUrl = `${BASE_URL}/${link.slug}`;

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleCopy = async () => {
    
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(`https://${shortUrl}`);
        return true;
      } catch (error) {
        console.error("Modern Clipboard API failed, trying fallback:", error);
      }
    }
  }

  return (
    <div
      className={[styles.card, !link.isActive ? styles.inactive : ""]
        .filter(Boolean)
        .join(" ")}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {/* Favicon + destination */}
      <div className={styles.main}>
        <div className={styles.favicon}>
          <Image
            src={getFaviconUrl(link.destinationUrl)}
            alt=""
            width={20}
            height={20}
            unoptimized
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* Fallback initial */}
          <span className={styles.faviconFallback}>
            {getDomain(link.destinationUrl).charAt(0).toUpperCase()}
          </span>
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{link.destinationUrl}</span>
            {!link.isActive && <Badge variant="destructive">Inactive</Badge>}
              {link.expiresAt && link.isActive && (
              <Badge variant="outline">
                Expires {formatDate(link.expiresAt)}
              </Badge>
            )}
          </div>
          <a
            href={link.destinationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.destination}
            title={link.destinationUrl}
          >
            {getDomain(link.destinationUrl)}
            <svg
              viewBox="0 0 12 12"
              fill="none"
              className={styles.externalIcon}
            >
              <path
                d="M5 2H2.5A.5.5 0 0 0 2 2.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V7M7 2h3v3M9.5 2.5l-5 5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Slug + copy */}
      <div className={styles.slugSection}>
        <Link href={`/links/${link.id}`} className={styles.slug}>
          <span className={styles.slugBase}>{BASE_URL}/</span>
          <span className={styles.slugPart}>{link.slug}</span>
        </Link>
        <Button value={`https://${shortUrl}`} size="icon-sm" onClick={handleCopy}>
          <Copy size={14} />
        </Button>
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <div className={styles.clicks}>
          <svg viewBox="0 0 14 14" fill="none">
            <path
              d="M5 2L11.5 7L7.5 8L6 12L5 2Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
          <span>{formatNumber(link.clicksCount)}</span>
        </div>
        <span className={styles.date}>{formatDate(link.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className={styles.actions} ref={menuRef}>
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Link actions"
          aria-expanded={menuOpen}
        >
          <svg viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="3" r="1.2" fill="currentColor" />
            <circle cx="8" cy="8" r="1.2" fill="currentColor" />
            <circle cx="8" cy="13" r="1.2" fill="currentColor" />
          </svg>
        </button>

        {menuOpen && (
          <div className={styles.menu}>
            <Link
              href={`/links/${link.id}`}
              className={styles.menuItem}
              onClick={() => setMenuOpen(false)}
            >
              <svg viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 9L9.5 1.5L12.5 4.5L5 12H2V9Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              Analytics
            </Link>
            <button
              className={styles.menuItem}
              onClick={() => {
                setMenuOpen(false);
                onEdit?.(link);
              }}
            >
              <svg viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 9L9.5 1.5L12.5 4.5L5 12H2V9Z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
              </svg>
              Edit
            </button>
            <button
              className={[styles.menuItem, styles.menuItemDanger].join(" ")}
              onClick={() => {
                setMenuOpen(false);
                onDelete?.(link);
              }}
            >
              <svg viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 3.5h10M5 3.5V2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v1M6 6.5v4M8 6.5v4M3 3.5l.75 8a.5.5 0 0 0 .5.5h5.5a.5.5 0 0 0 .5-.5l.75-8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
