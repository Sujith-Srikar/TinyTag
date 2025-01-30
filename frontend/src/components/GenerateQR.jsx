import React, { useState } from "react";
import axios from "axios";
import logo from "../../public/images/welcome.svg";

function QRCode() {
  const [content, setContent] = useState("");
  const [qrCode, setQRCode] = useState(null);
  const [logoURL, setLogoURL] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const [foreColor, setForeColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#000000");

  async function handleGenerateQRCode() {
    const formData = new FormData();
    if (content.length === 0) {
      alert("Content is required to generate a QR Code!");
      return;
    }
    try {
      formData.append("content", content);
      if (logoPath && logoURL)
        alert("Please select either a logo file or a logo URL, but not both.");
      else if (logoURL) formData.append("logo", logoURL);
      else if (logoPath) formData.append("logo", logoPath);

      const res = await axios.post(
        "http://localhost:8000/generateqr",
        formData,
        {
          responseType: "arraybuffer",
        }
      );
      const blob = new Blob([res.data], { type: "image/jpeg" });
      setQRCode(URL.createObjectURL(blob));
    } catch (err) {
      console.log(err);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files[0];
    setLogoPath(file);
  }

  return (
    <div className="w-full h-screen bg-gray-900 text-white font-sans flex flex-col items-center py-6">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">QR Code Generator</h1>

      {/* Content Input and Generate Button */}
      <div className="content-area flex flex-col justify-center items-center gap-4">
        <div className="flex items-center bg-gray-800 p-2 rounded-full">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter Content"
            className="bg-transparent w-80 p-3 rounded-full outline-none text-white placeholder-gray-400"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={() => setContent("")}
            className="lucide lucide-circle-x cursor-pointer ml-2 text-gray-400 hover:text-white"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <button
          onClick={handleGenerateQRCode}
          className="px-8 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-sm uppercase tracking-wide font-medium shadow-lg transform hover:scale-105 transition-all"
        >
          Generate QR Code
        </button>
      </div>

      {/* QR Code Display and Options */}
      <div className="qrbox w-full flex flex-wrap justify-evenly items-center mt-8">
        {/* Logo and Color Options */}
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex items-center justify-center w-14 h-14 bg-purple-600 rounded-full"
          >
            <img src={logo} alt="Upload Icon" className="w-6 h-6" />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex items-center gap-2">
            {/* Foreground Color Picker */}
            <div className="relative w-10 h-10">
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: foreColor }}
              ></div>
              <input
                type="color"
                value={foreColor}
                onChange={(e) => setForeColor(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            {/* Background Color Picker */}
            <div className="relative w-10 h-10">
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: bgColor }}
              ></div>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="w-60 h-60 border-2 border-gray-800 flex justify-center items-center">
          {qrCode ? (
            <img src={qrCode} alt="QR Code" className="max-w-full max-h-full" />
          ) : (
            <span className="text-gray-400">Your QR Code will appear here</span>
          )}
        </div>

        {/* Download Options */}
        <div className="flex flex-col items-center gap-2">
          <a
            href={qrCode}
            download="qrcode.png"
            className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all"
          >
            Download PNG
          </a>
          <button className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all">
            Download PDF
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all">
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRCode;
