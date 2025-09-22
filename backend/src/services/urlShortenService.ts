import URL from "../config/firebase";
import encodeToBase62 from "../utils/base62";

let counter = 12345678;

async function urlShortenService(alias: string | undefined, longUrl: string) {
  if (!longUrl) {
    throw new Error("Long URL is required");
  }

  try {
    new globalThis.URL(longUrl);
  } catch {
    throw new Error("Invalid URL format");
  }

  const baseUrl = "https://tinytag.xyz/";

  if (alias) {
    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
      throw new Error(
        "Custom alias can only contain letters, numbers, hyphens, and underscores"
      );
    }

    if (alias.length < 3 || alias.length > 20) {
      throw new Error("Custom alias must be between 3 and 20 characters");
    }

    const docRef = URL.doc(alias);
    const doc = await docRef.get();

    if (doc.exists) {
      throw new Error("Custom alias already exists");
    }

    await docRef.set({
      longUrl,
      shortCode: alias,
      createdAt: new Date(),
      clickcount: 0,
    });

    return `${baseUrl}${alias}`;
  } else {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const shortCode = encodeToBase62(counter++);
      const docRef = URL.doc(shortCode);
      const doc = await docRef.get();

      if (!doc.exists) {
        await docRef.set({
          longUrl,
          shortCode,
          createdAt: new Date(),
          clickcount: 0,
        });

        return `${baseUrl}${shortCode}`;
      }

      attempts++;
    }

    throw new Error(
      "Failed to generate unique short URL after multiple attempts"
    );
  }
}

export default urlShortenService;