"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/Layout";
import { LinkList } from "@/features/components/dashboard";
import { type LinkRecord } from "@repo/shared";
import { LinkBuilder } from "@/features/components/links/LinkBuilder";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { DeleteConfirmModal } from "@/components/UI";
import styles from "./page.module.scss";

export default function DashboardPage() {

  const [links, setLinks] = useState<LinkRecord[]>([]);

  const linkBuilder = useLinkBuilderStore();
  const trpc = useTRPC();
  const { data } = useQuery(trpc.get.getMyUrls.queryOptions());

  useEffect(() => {
    if (!data) return;

    setLinks(data);
  }, [data]);

  return (
    <div className={styles.page}>
      <TopBar title="Dashboard" subtitle="All your links in one place" />

      <div className={styles.content}>
        <LinkList
          links={links}
          onCreateNew={() => linkBuilder.openCreate()}
          onEdit={(link) => linkBuilder.openEdit(link)}
          onDelete={(link) => linkBuilder.openDelete(link)}
        />
      </div>

      <LinkBuilder />
      <DeleteConfirmModal />
    </div>
  );
}
