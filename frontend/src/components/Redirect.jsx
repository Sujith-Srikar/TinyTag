import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export function Redirect() {
  const { shorturl } = useParams();
  const [validUrl, setValidUrl] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Backend URL

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/url/${shorturl}`);
        setValidUrl(true);
        window.location.href = res.data;
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