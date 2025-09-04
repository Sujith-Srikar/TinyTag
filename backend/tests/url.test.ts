import { describe, it, expect, beforeEach, mock } from "bun:test";
import type { Request, Response } from "express";
import {
  urlShorten,
  urlRedirection,
  urlAnalytic,
  urlEditLongUrl,
  urlDelete,
} from "../controllers/urlController";
import urlShortenService from "../services/urlShortenService";
import urlRedirectionService from "../services/urlRedirectionService";
import urlAnalyticService from "../services/urlAnalyticService";

// Mock the services
mock.module("../services/urlShortenService", () => ({
  default: mock(() => Promise.resolve("https://tinytag.xyz/abc123")),
}));

mock.module("../services/urlRedirectionService", () => ({
  default: mock(() => Promise.resolve("https://example.com")),
}));

mock.module("../services/urlAnalyticService", () => ({
  default: mock(() =>
    Promise.resolve({
      longUrl: "https://example.com",
      shortCode: "abc123",
      createdAt: new Date(),
      clickCount: 42,
    })
  ),
}));

// Mock Firebase
mock.module("../config/firebase", () => ({
  default: {
    doc: mock(() => ({
      get: mock(() =>
        Promise.resolve({
          exists: true,
          data: () => ({
            longUrl: "https://example.com",
            shortCode: "abc123",
            createdAt: new Date(),
            clickCount: 42,
          }),
          ref: {
            update: mock(() => Promise.resolve()),
            delete: mock(() => Promise.resolve()),
          },
        })
      ),
      update: mock(() => Promise.resolve()),
      delete: mock(() => Promise.resolve()),
    })),
  },
}));

describe("URL Shortening Tests", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let responseData: object;
  let statusCode: number;
  let redirectUrl: string;

  beforeEach(() => {
    responseData = {};
    statusCode = 200;
    redirectUrl = "";

    mockReq = {
      body: {},
      params: {},
    };

    mockRes = {
      status: mock((code: number) => {
        statusCode = code;
        return mockRes as Response;
      }),
      json: mock((data: object) => {
        responseData = data;
        return mockRes as Response;
      }),
      redirect: mock((codeOrUrl: number | string, url?: string) => {
        if (typeof codeOrUrl === "number" && url) {
          statusCode = codeOrUrl;
          redirectUrl = url;
        } else if (typeof codeOrUrl === "string") {
          statusCode = 302; // default redirect status
          redirectUrl = codeOrUrl;
        }
        return mockRes as Response;
      }),
    };
  });

  describe("URL Shortening - POST /api/url/shorten", () => {
    describe("Valid Requests", () => {
      it("should shorten URL without custom alias", async () => {
        mockReq.body = { longUrl: "https://example.com" };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(201);
        expect(responseData).toEqual({
          success: true,
          message: "URL shortened successfully",
          shortUrl: "https://tinytag.xyz/abc123",
          data: {
            shortUrl: "https://tinytag.xyz/abc123",
            longUrl: "https://example.com",
          },
        });
      });

      it("should shorten URL with custom alias", async () => {
        mockReq.body = {
          longUrl: "https://example.com",
          alias: "my-custom-alias",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(201);
        expect(responseData).toEqual(
          expect.objectContaining({
            success: true,
            message: "URL shortened successfully",
          })
        );
      });

      it("should handle complex URLs", async () => {
        mockReq.body = {
          longUrl:
            "https://example.com/path?param1=value1&param2=value2#section",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(201);
        expect(responseData).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });

      it("should handle URLs with special characters", async () => {
        mockReq.body = {
          longUrl: "https://example.com/search?q=hello%20world&type=special",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(201);
        expect(responseData).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });

      it("should handle different URL schemes", async () => {
        mockReq.body = { longUrl: "ftp://files.example.com/document.pdf" };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(201);
        expect(responseData).toEqual(
          expect.objectContaining({
            success: true,
          })
        );
      });
    });

    describe("Invalid Requests", () => {
      it("should reject missing longUrl", async () => {
        mockReq.body = {};

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });

      it("should reject null longUrl", async () => {
        mockReq.body = { longUrl: null };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });

      it("should reject empty longUrl", async () => {
        mockReq.body = { longUrl: "" };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });

      it("should reject invalid URL format", async () => {
        const mockUrlShortenService = urlShortenService as any;
        mockUrlShortenService.mockRejectedValueOnce(
          new Error("Invalid URL format")
        );

        mockReq.body = { longUrl: "not-a-valid-url" };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Invalid URL format",
        });
      });

      it("should reject invalid custom alias", async () => {
        const mockUrlShortenService = urlShortenService as any;
        mockUrlShortenService.mockRejectedValueOnce(
          new Error(
            "Custom alias can only contain letters, numbers, hyphens, and underscores"
          )
        );

        mockReq.body = {
          longUrl: "https://example.com",
          alias: "invalid@alias!",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error:
            "Custom alias can only contain letters, numbers, hyphens, and underscores",
        });
      });

      it("should reject existing custom alias", async () => {
        const mockUrlShortenService = urlShortenService as any;
        mockUrlShortenService.mockRejectedValueOnce(
          new Error("Custom alias already exists")
        );

        mockReq.body = {
          longUrl: "https://example.com",
          alias: "existing-alias",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Custom alias already exists",
        });
      });

      it("should handle service errors", async () => {
        const mockUrlShortenService = urlShortenService as any;
        mockUrlShortenService.mockRejectedValueOnce(
          new Error("Database connection failed")
        );

        mockReq.body = { longUrl: "https://example.com" };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(500);
        expect(responseData).toEqual({
          success: false,
          error: "Failed to shorten URL",
        });
      });
    });
  });

  describe("URL Redirection - GET /api/url/:shortCode", () => {
    describe("Valid Requests", () => {
      it("should redirect to long URL", async () => {
        mockReq.params = { shortCode: "abc123" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(301);
        expect(redirectUrl).toBe("https://example.com");
      });

      it("should redirect with alphanumeric short code", async () => {
        mockReq.params = { shortCode: "xyz789" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(301);
        expect(redirectUrl).toBe("https://example.com");
      });

      it("should redirect with custom alias", async () => {
        mockReq.params = { shortCode: "my-custom-alias" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(301);
        expect(redirectUrl).toBe("https://example.com");
      });
    });

    describe("Invalid Requests", () => {
      it("should handle missing short code", async () => {
        mockReq.params = {};

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code is required",
        });
      });

      it("should handle empty short code", async () => {
        mockReq.params = { shortCode: "" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code is required",
        });
      });

      it("should handle non-existent short code", async () => {
        const mockUrlRedirectionService = urlRedirectionService as any;
        mockUrlRedirectionService.mockRejectedValueOnce(
          new Error("Short URL not found")
        );

        mockReq.params = { shortCode: "nonexistent" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(404);
        expect(responseData).toEqual({
          success: false,
          error: "Short URL not found",
        });
      });

      it("should handle service errors", async () => {
        const mockUrlRedirectionService = urlRedirectionService as any;
        mockUrlRedirectionService.mockRejectedValueOnce(
          new Error("Database connection failed")
        );

        mockReq.params = { shortCode: "abc123" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(500);
        expect(responseData).toEqual({
          success: false,
          error: "Failed to redirect URL",
        });
      });
    });
  });

  describe("URL Analytics - GET /api/url/analytics/:shortCode", () => {
    describe("Valid Requests", () => {
      it("should return analytics data", async () => {
        mockReq.params = { shortCode: "abc123" };

        await urlAnalytic(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual({
          success: true,
          data: {
            longUrl: "https://example.com",
            shortCode: "abc123",
            createdAt: expect.any(Date),
            clickCount: 42,
          },
        });
      });

      it("should return analytics for custom alias", async () => {
        mockReq.params = { shortCode: "my-custom-alias" };

        await urlAnalytic(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual(
          expect.objectContaining({
            success: true,
            data: expect.any(Object),
          })
        );
      });
    });

    describe("Invalid Requests", () => {
      it("should handle missing short code", async () => {
        mockReq.params = {};

        await urlAnalytic(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code is required",
        });
      });

      it("should handle non-existent short code", async () => {
        const mockUrlAnalyticService = urlAnalyticService as any;
        mockUrlAnalyticService.mockRejectedValueOnce(
          new Error("Short URL not found")
        );

        mockReq.params = { shortCode: "nonexistent" };

        await urlAnalytic(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(404);
        expect(responseData).toEqual({
          success: false,
          error: "Short URL not found",
        });
      });

      it("should handle service errors", async () => {
        const mockUrlAnalyticService = urlAnalyticService as any;
        mockUrlAnalyticService.mockRejectedValueOnce(
          new Error("Database connection failed")
        );

        mockReq.params = { shortCode: "abc123" };

        await urlAnalytic(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(500);
        expect(responseData).toEqual({
          success: false,
          error: "Failed to fetch analytics",
        });
      });
    });
  });

  describe("URL Edit - PUT /api/url/edit/:shortCode", () => {
    describe("Valid Requests", () => {
      it("should update long URL", async () => {
        mockReq.params = { shortCode: "abc123" };
        mockReq.body = { newLongUrl: "https://newexample.com" };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual({
          success: true,
          message: "URL updated successfully",
        });
      });

      it("should update with complex URL", async () => {
        mockReq.params = { shortCode: "abc123" };
        mockReq.body = {
          newLongUrl: "https://newexample.com/path?param=value#section",
        };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual({
          success: true,
          message: "URL updated successfully",
        });
      });
    });

    describe("Invalid Requests", () => {
      it("should handle missing short code", async () => {
        mockReq.params = {};
        mockReq.body = { newLongUrl: "https://newexample.com" };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code and new long URL are required",
        });
      });

      it("should handle missing new long URL", async () => {
        mockReq.params = { shortCode: "abc123" };
        mockReq.body = {};

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code and new long URL are required",
        });
      });

      it("should handle invalid URL format", async () => {
        mockReq.params = { shortCode: "abc123" };
        mockReq.body = { newLongUrl: "not-a-valid-url" };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Invalid URL format",
        });
      });

      it("should handle same URL update", async () => {
        // Mock Firebase to return the same URL
        const URL = require("../config/firebase").default;
        URL.doc.mockReturnValueOnce({
          get: mock(() =>
            Promise.resolve({
              exists: true,
              data: () => ({
                longUrl: "https://example.com",
                shortCode: "abc123",
              }),
            })
          ),
        });

        mockReq.params = { shortCode: "abc123" };
        mockReq.body = { newLongUrl: "https://example.com" };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "New URL is the same as current URL",
        });
      });

      it("should handle non-existent short code", async () => {
        // Mock Firebase to return non-existent document
        const URL = require("../config/firebase").default;
        URL.doc.mockReturnValueOnce({
          get: mock(() =>
            Promise.resolve({
              exists: false,
            })
          ),
        });

        mockReq.params = { shortCode: "nonexistent" };
        mockReq.body = { newLongUrl: "https://newexample.com" };

        await urlEditLongUrl(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(404);
        expect(responseData).toEqual({
          success: false,
          error: "Short URL not found",
        });
      });
    });
  });

  describe("URL Delete - DELETE /api/url/:shortCode", () => {
    describe("Valid Requests", () => {
      it("should delete short URL", async () => {
        mockReq.params = { shortCode: "abc123" };

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual({
          success: true,
          message: "Short URL deleted successfully",
        });
      });

      it("should delete custom alias", async () => {
        mockReq.params = { shortCode: "my-custom-alias" };

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(200);
        expect(responseData).toEqual({
          success: true,
          message: "Short URL deleted successfully",
        });
      });
    });

    describe("Invalid Requests", () => {
      it("should handle missing short code", async () => {
        mockReq.params = {};

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code is required",
        });
      });

      it("should handle empty short code", async () => {
        mockReq.params = { shortCode: "" };

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Short code is required",
        });
      });

      it("should handle non-existent short code", async () => {
        // Mock Firebase to return non-existent document
        const URL = require("../config/firebase").default;
        URL.doc.mockReturnValueOnce({
          get: mock(() =>
            Promise.resolve({
              exists: false,
            })
          ),
        });

        mockReq.params = { shortCode: "nonexistent" };

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(404);
        expect(responseData).toEqual({
          success: false,
          error: "Short URL not found",
        });
      });

      it("should handle service errors", async () => {
        // Mock Firebase to throw error
        const URL = require("../config/firebase").default;
        URL.doc.mockReturnValueOnce({
          get: mock(() => Promise.reject(new Error("Database error"))),
        });

        mockReq.params = { shortCode: "abc123" };

        await urlDelete(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(500);
        expect(responseData).toEqual({
          success: false,
          error: "Failed to delete URL",
        });
      });
    });
  });

  describe("Edge Cases and Security", () => {
    describe("Malicious Input Handling", () => {
      it("should handle SQL injection attempts in short code", async () => {
        mockReq.params = { shortCode: "'; DROP TABLE urls; --" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(301);
        // Should treat it as a normal short code, not execute SQL
      });

      it("should handle XSS attempts in custom alias", async () => {
        const mockUrlShortenService = urlShortenService as any;
        mockUrlShortenService.mockRejectedValueOnce(
          new Error(
            "Custom alias can only contain letters, numbers, hyphens, and underscores"
          )
        );

        mockReq.body = {
          longUrl: "https://example.com",
          alias: "<script>alert('xss')</script>",
        };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error:
            "Custom alias can only contain letters, numbers, hyphens, and underscores",
        });
      });

      it("should handle very long short codes", async () => {
        const longShortCode = "a".repeat(1000);
        mockReq.params = { shortCode: longShortCode };

        await urlRedirection(mockReq as Request, mockRes as Response);

        // Should handle gracefully without crashing
        expect([301, 404, 500]).toContain(statusCode);
      });

      it("should handle special characters in short code", async () => {
        mockReq.params = { shortCode: "test@#$%^&*()_+" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        // Should handle gracefully
        expect([301, 404, 500]).toContain(statusCode);
      });
    });

    describe("Performance Edge Cases", () => {
      it("should handle very long URLs", async () => {
        const veryLongUrl = "https://example.com/" + "a".repeat(2000);
        mockReq.body = { longUrl: veryLongUrl };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect([201, 400, 500]).toContain(statusCode);
      });

      it("should handle concurrent requests", async () => {
        mockReq.body = { longUrl: "https://example.com" };

        const promises = Array(10)
          .fill(null)
          .map(() => urlShorten(mockReq as Request, mockRes as Response));

        await Promise.all(promises);

        // All requests should complete without error
        expect([201, 500]).toContain(statusCode);
      });
    });

    describe("Data Validation Edge Cases", () => {
      it("should handle numeric strings as short codes", async () => {
        mockReq.params = { shortCode: "123456" };

        await urlRedirection(mockReq as Request, mockRes as Response);

        expect([301, 404, 500]).toContain(statusCode);
      });

      it("should handle boolean values in request body", async () => {
        mockReq.body = { longUrl: true as any };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });

      it("should handle array values in request body", async () => {
        mockReq.body = { longUrl: ["https://example.com"] as any };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });

      it("should handle object values in request body", async () => {
        mockReq.body = { longUrl: { url: "https://example.com" } as any };

        await urlShorten(mockReq as Request, mockRes as Response);

        expect(statusCode).toBe(400);
        expect(responseData).toEqual({
          success: false,
          error: "Long URL is required and must be a valid string",
        });
      });
    });
  });
});
