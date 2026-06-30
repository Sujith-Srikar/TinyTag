import { logger } from "./logger";

type Metrics = Record<string, number>;

type Metadata = Record<string, unknown>;

const enabled =
  process.env.NODE_ENV === "development" ||
  process.env.ENABLE_PERFORMANCE === "true";

export interface PerformanceCollector {
  measure<T>(name: string, fn: () => Promise<T>): Promise<T>;
  getTiming(key: string): number | undefined;
  finish(metadata?: Metadata): void;
}

export function createPerformance(
  operation: string,
  context: Metadata = {},
): PerformanceCollector {
  if (!enabled) {
    return {
      async measure<T>(_name: string, fn: () => Promise<T>) {
        return fn();
      },
      getTiming() {return undefined;},
      finish() {},
    };
  }

  const start = performance.now();
  const timings: Metrics = {};

  return {
    async measure<T>(
      name: string,
      fn: () => Promise<T>,
    ): Promise<T> {
      const stepStart = performance.now();

      try {
        return await fn();
      } finally {
        timings[name] = performance.now() - stepStart;
      }
    },
    getTiming(key: string){
      return timings[key];
    },
    finish(metadata = {}) {
      logger.info("Performance", {
        operation,
        ...context,
        ...metadata,
        timings,
        total: performance.now() - start,
      });
    },
  };
}