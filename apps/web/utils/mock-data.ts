// ─────────────────────────────────────────────────────────────────────────────
// File: apps/web/utils/mock-data.ts
// ─────────────────────────────────────────────────────────────────────────────

export interface LinkRecord {
  id: string;
  slug: string;
  destination: string;
  title: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  isActive?: boolean;
  favicon?: string;
}

export interface ClickDataPoint {
  date: string;
  clicks: number;
}

export interface ReferrerRow {
  source: string;
  clicks: number;
  pct: number;
}

export interface GeoRow {
  country: string;
  flag: string;
  clicks: number;
  pct: number;
}

// ─── Links ────────────────────────────────────────────────────────────────────

export const MOCK_LINKS: LinkRecord[] = [
  {
    id: "lnk_01",
    slug: "launch-post",
    destination: "https://www.producthunt.com/posts/tinytag",
    title: "TinyTag on Product Hunt",
    clicks: 3842,
    createdAt: "2026-05-01T09:00:00Z",
    isActive: true,
  },
  {
    id: "lnk_02",
    slug: "docs",
    destination: "https://docs.tinytag.io/getting-started",
    title: "Getting Started — TinyTag Docs",
    clicks: 1274,
    createdAt: "2026-05-03T14:30:00Z",
    isActive: true,
  },
  {
    id: "lnk_03",
    slug: "gh",
    destination: "https://github.com/tinytag/tinytag",
    title: "GitHub — TinyTag",
    clicks: 988,
    createdAt: "2026-05-03T14:32:00Z",
    isActive: true,
  },
  {
    id: "lnk_04",
    slug: "yt-demo",
    destination: "https://youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Product Demo Video",
    clicks: 561,
    createdAt: "2026-05-07T11:00:00Z",
    expiresAt: "2026-08-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "lnk_05",
    slug: "beta-invite",
    destination: "https://tinytag.io/beta",
    title: "Beta Invite Page",
    clicks: 420,
    createdAt: "2026-05-10T08:15:00Z",
    isActive: true,
  },
  {
    id: "lnk_06",
    slug: "tw",
    destination: "https://twitter.com/tinytag",
    title: "Twitter / X Profile",
    clicks: 312,
    createdAt: "2026-05-11T10:00:00Z",
    isActive: true,
  },
  {
    id: "lnk_07",
    slug: "old-lp",
    destination: "https://tinytag.io/v1",
    title: "Old Landing Page (v1)",
    clicks: 88,
    createdAt: "2026-04-15T12:00:00Z",
    isActive: false,
  },
  {
    id: "lnk_08",
    slug: "pricing",
    destination: "https://tinytag.io/pricing",
    title: "Pricing Page",
    clicks: 734,
    createdAt: "2026-05-14T09:30:00Z",
    isActive: true,
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

export const MOCK_STATS = {
  totalLinks: MOCK_LINKS.length,
  activeLinks: MOCK_LINKS.filter((l) => l.isActive).length,
  totalClicks: MOCK_LINKS.reduce((s, l) => s + l.clicks, 0),
  avgCtr: 4.7,
};

// ─── Click time-series (last 30 days) ────────────────────────────────────────

function generateClickSeries(
  days: number,
  base: number,
  variance: number,
): ClickDataPoint[] {
  const series: ClickDataPoint[] = [];
  const now = new Date("2026-05-23");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const weekendBoost = [0, 6].includes(d.getDay()) ? 0.6 : 1;
    const trend = 1 + ((days - i) / days) * 0.4;
    const clicks = Math.round(
      (base + Math.random() * variance - variance / 2) * weekendBoost * trend,
    );
    series.push({
      date: d.toISOString().split("T")[0]!,
      clicks: Math.max(0, clicks),
    });
  }
  return series;
}

export const MOCK_CLICK_SERIES_30D = generateClickSeries(30, 280, 180);
export const MOCK_CLICK_SERIES_7D = MOCK_CLICK_SERIES_30D.slice(-7);
export const MOCK_CLICK_SERIES_90D = generateClickSeries(90, 220, 200);

export function getMockClickSeries(
  linkId: string,
  range: "7d" | "30d" | "90d",
): ClickDataPoint[] {
  const multipliers: Record<string, number> = {
    lnk_01: 1.4,
    lnk_02: 0.5,
    lnk_03: 0.4,
    lnk_04: 0.2,
    lnk_05: 0.16,
    lnk_06: 0.12,
    lnk_07: 0.03,
    lnk_08: 0.28,
  };
  const m = multipliers[linkId] ?? 0.3;
  const base =
    range === "90d"
      ? MOCK_CLICK_SERIES_90D
      : range === "30d"
        ? MOCK_CLICK_SERIES_30D
        : MOCK_CLICK_SERIES_7D;
  return base.map((d) => ({ ...d, clicks: Math.round(d.clicks * m) }));
}

// ─── Referrers ────────────────────────────────────────────────────────────────

export const MOCK_REFERRERS: ReferrerRow[] = [
  { source: "producthunt.com", clicks: 1820, pct: 47.4 },
  { source: "twitter.com", clicks: 834, pct: 21.7 },
  { source: "Direct / None", clicks: 610, pct: 15.9 },
  { source: "github.com", clicks: 280, pct: 7.3 },
  { source: "linkedin.com", clicks: 180, pct: 4.7 },
  { source: "Other", clicks: 118, pct: 3.0 },
];

// ─── Geo ──────────────────────────────────────────────────────────────────────

export const MOCK_GEO: GeoRow[] = [
  { country: "United States", flag: "🇺🇸", clicks: 1640, pct: 42.7 },
  { country: "India", flag: "🇮🇳", clicks: 580, pct: 15.1 },
  { country: "United Kingdom", flag: "🇬🇧", clicks: 390, pct: 10.2 },
  { country: "Germany", flag: "🇩🇪", clicks: 280, pct: 7.3 },
  { country: "Canada", flag: "🇨🇦", clicks: 210, pct: 5.5 },
  { country: "France", flag: "🇫🇷", clicks: 160, pct: 4.2 },
  { country: "Other", flag: "🌐", clicks: 582, pct: 15.0 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getLinkById(id: string): LinkRecord | undefined {
  return MOCK_LINKS.find((l) => l.id === id);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function getFaviconUrl(url: string): string {
  try {
    const { protocol, hostname } = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${protocol}//${hostname}&sz=32`;
  } catch {
    return "";
  }
}
