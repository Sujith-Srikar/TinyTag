import URL from "../config/firebase";

async function urlRedirectionService(shortCode: string) {
  if (!shortCode) {
    throw new Error("Short code is required");
  }

  const doc = await URL.doc(shortCode).get();
  if (doc.exists) {
    const data = doc.data();
    if (!data) {
      throw new Error("Document data is undefined");
    }

    await doc.ref.update({ clickcount: (data.clickcount || 0) + 1 });
    return data.longUrl;
  } else {
    throw new Error("Short URL not found");
  }
}

export default urlRedirectionService;
