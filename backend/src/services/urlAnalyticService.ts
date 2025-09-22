import URL from "../config/firebase";

async function urlAnalyticService(shortCode: string) {
  if (!shortCode) {
    throw new Error("Short code is required");
  }

  const doc = await URL.doc(shortCode).get();
  if (doc.exists) {
    return doc.data();
  } else {
    throw new Error("Short URL not found");
  }
}

export default urlAnalyticService;
