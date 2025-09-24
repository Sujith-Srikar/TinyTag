import { type Request, type Response } from "express";
import urlRedirectionService from "../services/urlRedirectionService";
import urlShortenService from "../services/urlShortenService";
import urlAnalyticService from "../services/urlAnalyticService";
import URL from "../config/firebase";

async function urlShorten(req: Request, res: Response) {
  try {
    const { alias, longUrl } = req.body;

    // Validate that longUrl exists and is a string
    if (!longUrl || typeof longUrl !== "string" || longUrl.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Long URL is required and must be a valid string",
      });
    }

    const shortUrl = await urlShortenService(alias, longUrl);
    res.status(201).json({
      success: true,
      message: "URL shortened successfully",
      shortUrl,
      longUrl,
    });
  } catch (error: any) {
    console.error("URL shortening error:", error);

    if (
      error.message.includes("required") ||
      error.message.includes("Invalid") ||
      error.message.includes("alias")
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to shorten URL",
    });
  }
}

async function urlRedirection(req: Request, res: Response) {
  try {
    const shortCode = req.params.shortCode;

    if (!shortCode) {
      return res.status(400).json({
        success: false,
        error: "Short code is required",
      });
    }

    const longUrl = await urlRedirectionService(shortCode);
    res.status(200).json({data: longUrl});
  } catch (error: any) {
    console.error("URL redirection error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to redirect URL",
    });
  }
}

async function urlAnalytic(req: Request, res: Response) {
  try {
    const shortCode = req.params.shortCode;

    if (!shortCode) {
      return res.status(400).json({
        success: false,
        error: "Short code is required",
      });
    }

    const analytics = await urlAnalyticService(shortCode);
    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error: any) {
    console.error("URL analytics error:", error);

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics",
    });
  }
}

async function urlEditLongUrl(req: Request, res: Response) {
  try {
    const shortCode = req.params.shortCode;
    const { newLongUrl } = req.body;

    if (!shortCode || !newLongUrl) {
      return res.status(400).json({
        success: false,
        error: "Short code and new long URL are required",
      });
    }

    try {
      new globalThis.URL(newLongUrl);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid URL format",
      });
    }

    const docRef = URL.doc(shortCode);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    }

    const docData = doc.data();
    if (docData && docData.longUrl === newLongUrl) {
      return res.status(400).json({
        success: false,
        error: "New URL is the same as current URL",
      });
    }

    await docRef.update({ longUrl: newLongUrl });
    res.status(200).json({
      success: true,
      message: "URL updated successfully",
    });
  } catch (error: any) {
    console.error("URL edit error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update URL",
    });
  }
}

async function urlDelete(req: Request, res: Response) {
  try {
    const shortCode = req.params.shortCode;

    if (!shortCode) {
      return res.status(400).json({
        success: false,
        error: "Short code is required",
      });
    }

    const docRef = URL.doc(shortCode);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: "Short URL not found",
      });
    }

    await docRef.delete();
    res.status(200).json({
      success: true,
      message: "Short URL deleted successfully",
    });
  } catch (error: any) {
    console.error("URL deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete URL",
    });
  }
}

export { urlRedirection, urlShorten, urlAnalytic, urlEditLongUrl, urlDelete };
