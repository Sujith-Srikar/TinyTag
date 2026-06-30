export const StatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = (typeof StatusCode)[keyof typeof StatusCode];
// value-first typing pattern - provide value at run-time and compile time

interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  error: null;
}

interface ErrorResponse {
  success: false;
  data: null;
  error: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Response Helpers
export const createSuccessResponse = <T>(data: T): SuccessResponse<T> => ({
  success: true,
  data,
  error: null,
});

export const createErrorResponse = (error: string): ErrorResponse => ({
  success: false,
  data: null,
  error,
});

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogMessage {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

type HealthStatus =
  | "healthy"
  | "unhealthy";

type ReadyStatus =
  | "ok"
  | "error";

export interface DependencyHealth {
  status: HealthStatus;
  latencyMs: number;
  message?: string;
}

export interface HealthResponse {
  status: ReadyStatus;
  uptime: number;
  timestamp: string;

  checks: {
    server: {
      status: HealthStatus;
    };

    cache: DependencyHealth;

    db: DependencyHealth;
  };
}