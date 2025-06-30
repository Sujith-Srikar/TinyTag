const {encodeToBase62} = require("../utils/base62");
const URL = require("../config");

let c = 12345678;

async function createShortMapping(longUrl, shortUrl) {
  const doc = URL.doc(shortUrl);
  if ((await doc.get()).exists) return false; //shorturl already exists
  await doc.set({ longUrl, shortUrl, createdAt: new Date(), clickcount: 0 });
  return true;
}

async function getLongUrl(shortUrl) {
  const doc = await URL.doc(shortUrl).get();
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
    return doc.data();
  } else {
    throw new Error("URL not found");
  }
}

async function shortUrlGenerator(orgurl) {
    const shortcode = encodeToBase62(c++);
    let finalurl;
    const success = await createShortMapping(orgurl, shortcode); 
    if (success) {
        const baseurl = "https://tinytag.xyz/";
        finalurl = baseurl + shortcode;
    } else {
        return shortUrlGenerator(orgurl); 
    }
    return finalurl
}

async function editLinkDestination(shorturl, longurl) {
  const docRef = URL.doc(shorturl);
  const doc = await docRef.get();
  if(doc.exists){
    if(doc.data().longUrl === longurl) 
      throw new Error("LongURL already exists");
    await docRef.update({ longUrl: longurl, clickcount: doc.data().clickcount });
    return true;
  }
  else{
    throw new Error("ShortURL not found");
  }
}

async function createAlias(shortCode, longurl) {
  if (!shortCode || !longurl) {
    throw new Error("Both shortCode and longUrl are required");
  }

  const docRef = URL.doc(shortCode); // Get the DocumentReference
  const doc = await docRef.get(); // Fetch the DocumentSnapshot

  if (doc.exists) {
    throw new Error("ShortURL already exists");
  }

  await docRef.set({
    longUrl: longurl,
    shortCode,
    createdAt: new Date(),
    clickcount: 0,
  });

  const baseUrl = "https://tinytag.xyz/";
  return `${baseUrl}${shortCode}`;
}

async function deleteShortUrl(shorturl) {
  try {
    const docRef = URL.doc(shorturl);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error("Short URL not found");
    }

    await docRef.delete();
    return { message: "Short URL deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = {
  shortUrlGenerator,
  createShortMapping,
  getLongUrl,
  handleGetAnalytics,
  editLinkDestination,
  createAlias,
  deleteShortUrl
};