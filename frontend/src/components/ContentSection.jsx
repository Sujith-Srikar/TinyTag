import React from "react";
import { Link } from "react-router-dom";

function ContentSection() {
    return (
      <>
        <div className="min-h-screen bg-[#A78BFA] text-[#2A3439] flex flex-col justify-evenly items-center">
          <h1
            className="text-[5rem] text-[#A78BFA]"
            style={{
              WebkitTextStroke: "2px #2A3439",
            }}
          >
            SHORT URL X QR Codes
          </h1>

          <h3 className="text-[1.5vw] text-wrap">
            It is a simple and efficient tool that lets you shorten URLs and
            generate QR codes in seconds.{" "}
          </h3>
          <div className="flex gap-8">
            <Link className="p-4 border-2 border-[#2A3439] rounded-lg hover:bg-[#2A3439] hover:text-white">
              Generate ShortURL
            </Link>
            <Link to="/qrcode" className="p-4 border-2 border-[#2A3439] rounded-lg hover:bg-[#2A3439] hover:text-white">
              Generate QR Code
            </Link>
          </div>
        </div>
      </>
    );
}

export default ContentSection;