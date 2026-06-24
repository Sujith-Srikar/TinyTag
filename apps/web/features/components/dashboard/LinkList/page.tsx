"use client";

import { useState, useMemo } from "react";
import {
  Button,
  Input,
  AnimatedContainer,
  AnimatedList,
  AnimatedSelect,
  AnimatedTabs,
} from "@repo/ui";
import { LinkCard } from "../LinkCard/page";
import { type LinkRecord } from "@repo/shared";
import styles from "./page.module.scss";
import { LinkBuilderFields } from "@/types/linkBuilder";
import { Frown } from "lucide-react";

type SortKey = "clicks" | "createdAt" | "title";
type FilterStatus = "all" | "active" | "inactive";

interface LinkListProps {
  links: LinkRecord[];
  onCreateNew: () => void;
  onEdit: (link: LinkBuilderFields) => void;
  onDelete: (link: LinkBuilderFields) => void;
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

  const FILTER_TABS = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ];

  const SORT_OPTIONS = [
    {
      value: "createdAt",
      label: "Newest first",
    },
    {
      value: "clicks",
      label: "Most clicks",
    },
    {
      value: "title",
      label: "Alphabetical",
    },
  ];

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

          <AnimatedTabs
            value={filter}
            onValueChange={(value) => setFilter(value as FilterStatus)}
            items={FILTER_TABS}
          />
        </div>

        <div className={styles.toolbarRight}>
          <AnimatedSelect
            value={sort}
            onValueChange={(value) => setSort(value as SortKey)}
            options={SORT_OPTIONS}
          />

          <Button size="sm" onClick={onCreateNew}>
            New Link
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <Frown />
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
          <AnimatedList className={styles.list}>
            {filtered.map((link, i) => (
              <AnimatedContainer key={link.id} delay={i * 0.03}>
                <LinkCard
                  link={link}
                  index={i}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </AnimatedContainer>
            ))}
          </AnimatedList>
        </>
      )}
    </div>
  );
}
