import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { db, doc, getDoc, updateDoc } from "../firebase";

async function getLongUrl(shortUrl) {
  const docRef = doc(db, "url", shortUrl); // <--- get doc ref from collection "url"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    await updateDoc(docRef, { clickcount: data.clickcount + 1 });
    return data.longUrl;
  } else {
    throw new Error("URL not found");
  }
}

function Redirect() {
  const { shorturl } = useParams();
  const [validUrl, setValidUrl] = useState(true);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const longUrl = await getLongUrl(shorturl);
        setValidUrl(true);
        window.location.href = longUrl;
      } catch (error) {
        console.error("Error fetching URL:", error);
        setValidUrl(false);
        toast.error(error.message || "Something went wrong");
      }
    }

    fetchUrl();
  }, [shorturl]);

  return (
    <div className="text-white flex justify-center items-center mt-5 h-screen">
      {validUrl ? (
        <h2 className="text-2xl">Redirecting...</h2>
      ) : (
        <h2 className="text-2xl">Invalid Short URL</h2>
      )}
    </div>
  );
}

export default Redirect;