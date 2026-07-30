"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Trash, Lock } from "lucide-react";
import { Badge, Button, CopyButton, getExpiryInfo } from "@repo/ui";
import {
  getDomain,
  formatNumber,
  getFaviconUrl,
} from "@/utils/formatters";
import { type LinkRecord, APP_URL, LinkBuilderFields } from "@repo/shared";
import styles from "./page.module.scss";

interface LinkCardProps {
  link: LinkRecord;
  index?: number;
  onEdit?: (link: LinkBuilderFields) => void;
  onDelete?: (link: LinkBuilderFields) => void;
}

export function LinkCard({ link, index = 0, onEdit, onDelete }: LinkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [faviconLoaded, setFaviconLoaded] = useState<boolean>(false);
  const [faviconFailed, setFaviconFailed] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const shortUrl = `${APP_URL}/${link.slug}`;

  const editLink: LinkBuilderFields = {
    destinationUrl: link.destinationUrl,
    slug: link.slug,
    expiresAt: link.expiresAt ? new Date(link.expiresAt) : undefined,
    comments: link.comments,
    tags: link.tags,
    hasPassword: link.hasPassword,
  };

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
          {!faviconLoaded && (
            <span className={styles.faviconFallback}>
              {getDomain(link.destinationUrl).charAt(0).toUpperCase()}
            </span>
          )}

          {/* Favicons are loaded from arbitrary user URLs, so native avoids Next.js
          remote hostname restrictions. */}
          {!faviconFailed && (
            <img
              src={getFaviconUrl(link.destinationUrl)}
              alt=""
              width={20}
              height={20}
              onLoad={() => setFaviconLoaded(true)}
              onError={() => {
                setFaviconFailed(true);
                setFaviconLoaded(false);
              }}
              loading="lazy"
              className={styles.faviconImage}
            />
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{link.destinationUrl}</span>
            {!link.isActive && <Badge variant="destructive">Inactive</Badge>}
            {link.expiresAt && (
              <Badge variant="outline">
                {getExpiryInfo(link.expiresAt).label}
              </Badge>
            )}
            {link.hasPassword && ( <Lock size={14} />)}
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
        <div className={styles.slug}>
          <span className={styles.slugBase}>{APP_URL}/</span>
          <span className={styles.slugPart}>{link.slug}</span>
        </div>
        <CopyButton value={`https://${shortUrl}`} />
        {/* <Button
          variant="outline"
          value={`https://${shortUrl}`}
          size="icon-sm"
          onClick={handleCopy}
        >
          <Copy size={14} />
        </Button> */}
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
      </div>

      {/* Actions */}
      <div className={styles.actions} ref={menuRef}>
        <Button
          variant="ghost"
          size="icon-sm"
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
        </Button>

        {menuOpen && (
          <div className={styles.menu}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setMenuOpen(false);
                onEdit?.(editLink);
              }}
              className="bg-transparent"
            >
              <Pencil />
              Edit
            </Button>
            <Button
              onClick={() => {
                setMenuOpen(false);
                onDelete?.(editLink);
              }}
              variant="destructive"
              size="sm"
              className="bg-transparent"
            >
              <Trash />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
