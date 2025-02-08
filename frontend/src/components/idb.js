import { openDB } from "idb";

const DB_NAME = "urlShortenerDB";
const STORE_NAME = "urls";

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "shortUrl" });
      }
    },
  });
}

export async function addUrlToDB(urlData) {
  const db = await initDB();
  return db.put(STORE_NAME, urlData);
}

export async function getUrlsFromDB() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function updateUrlInDB(shortUrl, newLongUrl) {
  const db = await initDB();
  const data = await db.get(STORE_NAME, shortUrl);
  if (data) {
    data.longUrl = newLongUrl;
    await db.put(STORE_NAME, data);
  }
}

export async function deleteUrlFromDB(shortUrl) {
  const db = await initDB();
  return db.delete(STORE_NAME, shortUrl);
}