const {encodeToBase62} = require("../utils/base62");
const URL = require("../config");

let c = 12345678;

async function createShortMapping(longUrl, shortUrl) {
  const doc = URL.doc(shortUrl);
  if ((await doc.get()).exists) return false;
  await doc.set({ longUrl, shortUrl, createdAt: new Date(), clickcount: 0 });
  return true;
}

async function getLongUrl(shortUrl) {
  console.log(shortUrl)
  const doc = await URL.doc(shortUrl).get();
  console.log(doc)
  if (doc.exists) {
    await doc.ref.update({ clickcount: doc.data().clickcount + 1 });
    return doc.data().longUrl;
  } else {
    throw new Error("URL not found");
  }
}

async function handleGetAnalytics(shorturl) {
  const doc = await URL.doc(shorturl).get();
  if (doc.exists) {
    return doc.data().clickcount;
  } else {
    throw new Error("URL not found");
  }
}

async function shortUrlGenerator(orgurl) {
    const shortcode = encodeToBase62(c++);
    let finalurl;
    const success = await createShortMapping(orgurl, shortcode); 
    if (success) {
        const baseurl = "https://tinytag.onrender.com/";
        finalurl = baseurl + shortcode;
    } else {
        return shortUrlGenerator(orgurl); 
    }
    return finalurl
}

module.exports = {
  shortUrlGenerator,
  createShortMapping,
  getLongUrl,
  handleGetAnalytics,
};