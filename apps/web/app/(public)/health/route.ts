import { NextResponse } from "next/server";
import { getCacheHealth } from "@repo/cache";
import { getDbHealth } from "@repo/db";
import { createPerformance, StatusCode, DependencyHealth, HealthResponse } from "@repo/shared";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return JSON.stringify(error);
}

export async function GET() {
  const perf = createPerformance("health");

  const cache: DependencyHealth = {
    status: "healthy",
    latencyMs: 0,
  };

  const db: DependencyHealth = {
    status: "healthy",
    latencyMs: 0,
  };

  await Promise.all([
    perf.measure("cache", getCacheHealth).catch((error) => {
      cache.status = "unhealthy";
      cache.message = getErrorMessage(error);
    }),

    perf.measure("db", getDbHealth).catch((error) => {
      db.status = "unhealthy";
      db.message = getErrorMessage(error);
    }),
  ]);

  cache.latencyMs = Math.round(perf.getTiming("cache") ?? 0);
  db.latencyMs = Math.round(perf.getTiming("db") ?? 0);

  const response: HealthResponse = {
    status: cache.status === "healthy" && db.status === "healthy"? "ok" : "error",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      server: {status: "healthy"},
      cache,
      db,
    },
  };

  perf.finish({ status: response.status });

  return NextResponse.json(response, {
    status: StatusCode.OK,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}