import React, { useState } from "react";
import GenerateQR from "./GenerateQR";
import axios from "axios";

const URLShortener = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) {
      alert("Please enter a valid URL!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/generateurl",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        }
      );
      const data = await response.json();
      setShortUrl(data.shortUrl);

      const analyticsResponse = await fetch(
        `http://localhost:8000/analytics/${data.shortUrl}`
      );
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);
    } catch (error) {
      alert("Failed to shorten URL.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
        URL Shortener
      </h2>
      <input
        type="url"
        placeholder="Enter a long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 mb-4"
      />
      <button
        onClick={handleShorten}
        className={`w-full py-3 px-6 rounded-lg bg-cyan-500 text-white font-medium hover:bg-cyan-600 transition-all ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isLoading}
      >
        {isLoading ? "Shortening..." : "Shorten URL"}
      </button>

      {shortUrl && (
        <div className="mt-6">
          <p className="text-gray-300 mb-2">Shortened URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 underline"
          >
            {shortUrl}
          </a>
          {analytics && (
            <div className="mt-4 text-gray-400">
              <p>Clicks: {analytics.clicks}</p>
              <p>Date Created: {analytics.dateCreated}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default URLShortener;