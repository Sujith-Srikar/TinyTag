import React from "react";
import { Link } from "react-router-dom";

function ContentSection() {
  return (
    <div className="min-h-screen bg-[#A78BFA] text-[#2A3439] flex flex-col justify-evenly items-center px-4 sm:px-8 py-8">
      <h1
        className="text-[15vw] sm:text-[12vw] md:text-[5vw] lg:text-[5vw] text-center text-[#A78BFA] flex flex-col md:flex-row md:items-start items-center flex-wrap justify-center md:gap-6 gap-2"
        style={{ WebkitTextStroke: "2px #2A3439" }}
      >
        <span>SHORT URL</span>
        <span className="block sm:inline">X</span>
        <span>QR Codes</span>
      </h1>

      <h3 className="text-base sm:text-lg md:text-xl text-center max-w-lg">
        It is a simple and efficient tool that lets you shorten URLs and
        generate QR codes in seconds.
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        <Link
          to="/shorturl"
          className="p-4 border-2 border-[#2A3439] rounded-lg hover:bg-[#2A3439] hover:text-white transition"
        >
          Generate ShortURL
        </Link>
        <Link
          to="/qrcode"
          className="p-4 border-2 border-[#2A3439] rounded-lg hover:bg-[#2A3439] hover:text-white transition"
        >
          Generate QR Code
        </Link>
      </div>
    </div>
  );
}

export default ContentSection;
