"use client";

import { useState, useMemo } from "react";
import { Button, Input } from "@repo/ui";
import { LinkCard } from "../LinkCard/page";
import { type LinkRecord } from "@repo/shared";
import styles from "./page.module.scss";
import { LinkBuilderFields } from "@/types/linkBuilder";

type SortKey = "clicks" | "createdAt" | "title";
type FilterStatus = "all" | "active" | "inactive";

interface LinkListProps {
  links: LinkRecord[];
  onCreateNew: () => void;
  onEdit: (link: LinkBuilderFields) => void;
  onDelete: (link: LinkRecord) => void;
}

export function LinkList({
  links,
  onCreateNew,
  onEdit,
  onDelete,
}: LinkListProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered = useMemo(() => {
    let result = links;

    if (filter === "active") result = result.filter((l) => l.isActive);
    if (filter === "inactive") result = result.filter((l) => !l.isActive);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.slug.toLowerCase().includes(q) ||
          l.destinationUrl.toLowerCase().includes(q),
      );
    }

    return [...result].sort((a, b) => {
      if (sort === "clicks") return b.clicksCount - a.clicksCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [links, search, sort, filter]);

  return (
    <div className={styles.container}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.searchWrap}>
            <Input
              id="search-link"
              placeholder="Search links…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchLink}
            />
          </div>

          <div className={styles.filterGroup}>
            {(["all", "active", "inactive"] as FilterStatus[]).map((f) => (
              <Button
                key={f}
                className={[
                  styles.filterBtn,
                  filter === f ? styles.filterActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.toolbarRight}>
          <div className={styles.sortWrap}>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort links"
            >
              <option value="createdAt">Newest first</option>
              <option value="clicks">Most clicks</option>
              <option value="title">Alphabetical</option>
            </select>
            <svg className={styles.sortChevron} viewBox="0 0 12 12" fill="none">
              <path
                d="M2 4L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <Button size="sm" onClick={onCreateNew}>
            New Link
          </Button>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <svg viewBox="0 0 48 48" fill="none" width={48} height={48}>
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="var(--border)"
              strokeWidth="2"
            />
            <path
              d="M16 22a6 6 0 0 1 12 0M20 26h.01M28 26h.01"
              stroke="var(--text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className={styles.emptyTitle}>No links found</p>
          <p className={styles.emptyText}>
            {search
              ? "Try a different search term"
              : "Create your first link to get started"}
          </p>
          {!search && (
            <Button size="sm" onClick={onCreateNew}>
              Create link
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className={styles.listMeta}>
            <span>
              {filtered.length} link{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
          <ul className={styles.list}>
            {filtered.map((link, i) => (
              <li key={link.id}>
                <LinkCard
                  link={link}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
