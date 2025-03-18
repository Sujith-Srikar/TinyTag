import React, { useState, useEffect} from 'react'
import axios from "axios";
import { addUrlToDB, getUrlsFromDB, updateUrlInDB, deleteUrlFromDB } from "../components/idb";
import { MoreHorizontal, BarChart3, Trash2, Save, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/Header";

const API_BASE_URL = "http://ec2-52-66-9-103.ap-south-1.compute.amazonaws.com:8000"; // Backend URL

function URLShortener() {
  const [urls, setUrls] = useState([]);

  // Fetch URLs from IndexedDB on load
  useEffect(() => {
    async function fetchStoredUrls() {
      const storedUrls = await getUrlsFromDB();
      setUrls(storedUrls);
    }
    fetchStoredUrls();
  }, []);

  return (
    <>
      <MainSection setUrls={setUrls} urls={urls} />
      <Table urls={urls} setUrls={setUrls} />
    </>
  );
}

function MainSection({setUrls, urls}) {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [copy, setCopy] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopy(true);

      setTimeout(() => {
        setCopy(false);
      }, 1500);
    } catch (error) {
      toast.error("Error copying to clipboard");
    }
  } 

  // Shorten URL and update IndexedDB + UI
  const handleShorten = async () => {
    if (!longUrl.trim()) return toast.error("Please enter a URL");
    setLoading(true);
    try {
      const payload = { longUrl };
      if (customAlias) payload.shortCode = customAlias;
      const { data } = await axios.post(`${API_BASE_URL}/generateurl`, payload);
      const newUrl = { shortUrl: data.shorturl, longUrl };
      setShortUrl(data.shorturl);
      await addUrlToDB(newUrl);
      setUrls([...urls, newUrl]); 

      setLongUrl("");
      setCustomAlias("");
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="px-4 text-center py-16">
        <h1 className="text-[10vw] md:text-[4vw] font-bold mb-6 ">
          Shorten Your Loooong Links :)
        </h1>
        <div className="flex flex-col items-center justify-center gap-10 max-w-2xl mx-auto">
          <div className="flex flex-col items-start gap-3 w-full">
            <label htmlFor="longurl">Paste your link</label>
            <div className="w-full glass-panel bg-gray-900 flex border border-white rounded-full items-center justify-center px-6">
              <input
                id="longurl"
                type="text"
                placeholder="https://example.com/very-looong-url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="flex-grow z-0 w-full px-4 py-4 rounded-full bg-transparent text-white outline-none focus:outline-none focus:ring-0"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                onClick={() => setLongUrl("")}
                className="lucide lucide-circle-x cursor-pointer"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 w-full">
            <label htmlFor="customalias">Create your custom alias</label>
            <div className="flex flex-col md:flex-row items-center justify-around w-full">
              <div className="flex-grow  glass-panel w-full md:w-1/3 px-4 py-4 rounded-full bg-gray-900 text-white border border-gray-300 focus:outline-none focus:ring focus:ring-purple-500">
                tinytag.onrender.com
              </div>
              <span className="w-1/4 relative text-[10vw] md:text-[4vw]">
                /
              </span>
              <input
                id="customalias"
                type="text"
                placeholder="Enter your alias(Optional)"
                onChange={(e) => setCustomAlias(e.target.value)}
                className="flex-grow  glass-panel w-full md:w-1/3 px-4 py-4 rounded-full bg-gray-900 text-white border border-gray-300 outline-none"
              />
            </div>
          </div>
          {loading ? (
            <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
              <circle
                className="pl__ring pl__ring--a"
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 660"
                strokeDashoffset="-330"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--b"
                cx="120"
                cy="120"
                r="35"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 220"
                strokeDashoffset="-110"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--c"
                cx="85"
                cy="120"
                r="70"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 440"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--d"
                cx="155"
                cy="120"
                r="70"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 440"
                strokeLinecap="round"
              ></circle>
            </svg>
          ) : (
            <button
              onClick={handleShorten}
              className="px-10 py-4 rounded-full cursor-pointer border-0 bg-purple-600 shadow-md tracking-wider uppercase text-sm transition-all duration-500 ease-in-out hover:tracking-widest hover:bg-purple-600 hover:text-white hover:shadow-[0_7px_29px_0_rgba(93,24,220,1)] active:translate-y-2 active:transition-[100ms]"
            >
              Shorten Now!
            </button>
          )}

          {/* Short URL Result */}
          {shortUrl && (
            <div className="flex items-center justify-between gap-4 w-full px-6 py-4 rounded-lg bg-gray-800 text-white shadow-md">
              <a
                className="truncate text-blue-400"
                href={shortUrl}
                target="_blank"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopyToClipboard}
                className="bg-purple-600 px-4 py-2 rounded-md shadow-md hover:bg-purple-500 transition-all"
              >
                {copy ? <Check /> : <Copy />}
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Table({ urls, setUrls }) {
  const [selectedUrl, setSelectedUrl] = useState(null);

  const getShortCode = (shortUrl) => shortUrl.split("/").pop();

  return (
    <section className="w-full flex justify-center px-4">
      <div className="glass-panel bg-gray-900 w-full md:max-w-5xl text-white rounded-xl shadow-lg md:mx-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-auto min-w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 border-r border-gray-400 ">
                  Short Link
                </th>
                <th className="p-4 border-r border-gray-400 whitespace-nowrap hidden sm:table-cell">
                  Original Link
                </th>
                <th className="p-4 ">View More</th>
              </tr>
            </thead>
            <tbody>
              {urls.length > 0 ? (
                urls.map((url, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="p-4 truncate max-w-[200px]">
                      <a
                        href={url.shortUrl}
                        target="_blank"
                        className="text-blue-400 hover:underline break-all"
                      >
                        {url.shortUrl}
                      </a>
                    </td>
                    <td className="p-4 truncate max-w-[300px] hidden sm:table-cell">
                      <a
                        href={url.longUrl}
                        target="_blank"
                        className="text-gray-400 hover:underline break-all"
                      >
                        {url.longUrl}
                      </a>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedUrl(url)}
                        className="p-2 rounded-full hover:bg-gray-700 transition"
                      >
                        <MoreHorizontal size={24} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-400">
                    No URLs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* URL Modal */}
      {selectedUrl && (
        <URLModal
          url={selectedUrl}
          setUrls={setUrls}
          onClose={() => setSelectedUrl(null)}
        />
      )}
    </section>
  );
}

function URLModal({ url, setUrls, onClose }) {
  const [analytics, setAnalytics] = useState(0);
  const [longUrl, setLongUrl] = useState(url.longUrl);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch analytics on open
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/analytics/${url.shortUrl.split("/").pop()}`
        );
        setAnalytics(data.clickcount);
      } catch (err) {
        console.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [url]);

  // Save Updated Long URL
  const handleSaveLongUrl = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/editlinkdestination`, {
        shorturl: url.shortUrl.split("/").pop(),
        newLongUrl: longUrl,
      });
      
      setUrls((prev) =>
        prev.map((u) => (u.shortUrl === url.shortUrl ? { ...u, longUrl } : u))
      );
      await updateUrlInDB(url.shortUrl, longUrl);
      toast.success("Long URL updated!");
      onClose();
    } catch (err) {
      toast.error("Error updating URL");
    } finally {
      setSaving(false);
    }
  };

  // Delete Short URL
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this short URL?")) {
      try {
        await axios.delete(
          `${API_BASE_URL}/delete/${url.shortUrl.split("/").pop()}`
        );
        setUrls((prev) => prev.filter((u) => u.shortUrl !== url.shortUrl));
        await deleteUrlFromDB(url.shortUrl);
        toast.success("Short URL deleted!");
        onClose();
      } catch (err) {
        console.log(err)
        toast.error("Error deleting short URL.");
      }
    }
  };

  return (
    <div className="glass-panel fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-blue-400">URL Details</h2>

        {loading ? (
          <div className='flex justify-center'>
            <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
              <circle
                className="pl__ring pl__ring--a"
                cx="120"
                cy="120"
                r="105"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 660"
                strokeDashoffset="-330"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--b"
                cx="120"
                cy="120"
                r="35"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 220"
                strokeDashoffset="-110"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--c"
                cx="85"
                cy="120"
                r="70"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 440"
                strokeLinecap="round"
              ></circle>
              <circle
                className="pl__ring pl__ring--d"
                cx="155"
                cy="120"
                r="70"
                fill="none"
                stroke="#000"
                strokeWidth="20"
                strokeDasharray="0 440"
                strokeLinecap="round"
              ></circle>
            </svg>
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg flex justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="text-purple-400" size={24} />
              <p className="text-lg">Total Clicks</p>
            </div>
            <p className="text-xl font-bold text-yellow-400">{analytics}</p>
          </div>
        )}

        {/* Editable Long URL */}
        <div>
          <label className="text-md font-bold text-gray-300">
            Edit Long URL
          </label>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSaveLongUrl}
            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg mt-3 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
            <Save size={18} className="ml-2" />
          </button>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition"
        >
          Delete Short URL <Trash2 size={18} className="ml-2" />
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg mt-3 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}



export default URLShortener
