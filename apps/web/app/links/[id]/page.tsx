"use client";

import { notFound } from "next/navigation";
import {
  getLinkById,
  getMockClickSeries,
} from "@/utils/mock-data";

const BASE_URL = "tt.vercel.app";

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const link = getLinkById(params.id);

  if (!link) {
    notFound();
  }

  const data7d = getMockClickSeries(link.id, "7d");
  const data30d = getMockClickSeries(link.id, "30d");
  const data90d = getMockClickSeries(link.id, "90d");

  const shortUrl = `https://${BASE_URL}/${link.slug}`;

  return (
    <>Comming Soon</>
    // <div className={styles.page}>
    //   <TopBar
    //     title={link.title}
    //     subtitle={`Analytics for /${link.slug}`}
    //     breadcrumb={
    //       <Link href="/" className={styles.breadcrumbLink}>
    //         <svg viewBox="0 0 14 14" fill="none" width={14} height={14}>
    //           <path
    //             d="M8 2L3 7L8 12"
    //             stroke="currentColor"
    //             strokeWidth="1.5"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //           />
    //         </svg>
    //         Dashboard
    //       </Link>
    //     }
    //     actions={<CopyButton value={shortUrl} label="Copy URL" size="md" />}
    //   />

    //   {/* Link summary card */}
    //   <div className={styles.linkCard}>
    //     <div className={styles.linkCardMain}>
    //       {/* Favicon */}
    //       <div className={styles.favicon}>
    //         {/* eslint-disable-next-line @next/next/no-img-element */}
    //         <img
    //           src={getFaviconUrl(link.destination)}
    //           alt=""
    //           width={24}
    //           height={24}
    //           onError={(e) => {
    //             (e.target as HTMLImageElement).style.display = "none";
    //           }}
    //         />
    //       </div>

    //       <div className={styles.linkInfo}>
    //         <div className={styles.linkTitleRow}>
    //           <span className={styles.linkSlug}>
    //             {BASE_URL}/<strong>{link.slug}</strong>
    //           </span>
    //           <Badge
    //             variant={link.isActive ? "success" : "danger"}
    //             size="sm"
    //             dot
    //           >
    //             {link.isActive ? "Active" : "Inactive"}
    //           </Badge>
    //         </div>
    //         <a
    //           href={link.destination}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className={styles.linkDest}
    //         >
    //           {link.destination}
    //           <svg viewBox="0 0 12 12" fill="none" width={10} height={10}>
    //             <path
    //               d="M5 2H2.5A.5.5 0 0 0 2 2.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V7M7 2h3v3M9.5 2.5l-5 5"
    //               stroke="currentColor"
    //               strokeWidth="1.2"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //             />
    //           </svg>
    //         </a>
    //       </div>
    //     </div>

    //     <div className={styles.linkStats}>
    //       <div className={styles.statItem}>
    //         <span className={styles.statValue}>
    //           {formatNumber(link.clicks)}
    //         </span>
    //         <span className={styles.statLabel}>Total clicks</span>
    //       </div>
    //       <div className={styles.statDivider} />
    //       <div className={styles.statItem}>
    //         <span className={styles.statValue}>
    //           {formatDate(link.createdAt)}
    //         </span>
    //         <span className={styles.statLabel}>Created</span>
    //       </div>
    //       {link.expiresAt && (
    //         <>
    //           <div className={styles.statDivider} />
    //           <div className={styles.statItem}>
    //             <span className={styles.statValue}>
    //               {formatDate(link.expiresAt)}
    //             </span>
    //             <span className={styles.statLabel}>Expires</span>
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   </div>

    //   {/* Chart */}
    //   <div className={styles.content}>
    //     <ClickChart data7d={data7d} data30d={data30d} data90d={data90d} />

    //     <div className={styles.tables}>
    //       <ReferrerTable data={MOCK_REFERRERS} />
    //       <GeoTable data={MOCK_GEO} />
    //     </div>
    //   </div>
    // </div>
  );
}