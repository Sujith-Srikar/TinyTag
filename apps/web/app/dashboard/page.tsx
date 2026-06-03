"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/Layout";
import { LinkList } from "@/features/components/dashboard";
import { type LinkRecord } from "@repo/shared";
import { LinkBuilder } from "@/features/components/links/LinkBuilder";
import { useLinkBuilderStore } from "@/hooks/useLinkBuilder";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {

  const [links, setLinks] = useState<LinkRecord[]>([]);

  const linkBuilder = useLinkBuilderStore();
  const trpc = useTRPC();
  const {data} = useQuery(trpc.get.getAllUrls.queryOptions());


  useEffect(() => {
    if(!data) return;

    setLinks(data);
  }, [data]);

  return (
    <div>
      <TopBar title="Dashboard" subtitle="All your links in one place" />

      <LinkList
        links={links}
        onCreateNew={() => linkBuilder.openBuilder()}
        onEdit={(link) => linkBuilder.openBuilder(link)}
        onDelete={() => linkBuilder.openBuilder()}
      />

      <LinkBuilder />
    </div>
  );
}
