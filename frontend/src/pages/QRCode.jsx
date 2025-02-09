import React, { useState } from 'react'
import axios from 'axios';
import logo from "../../public/images/welcome.svg"
import toast from "react-hot-toast";

const API_BASE_URL = "https://tinytag.onrender.com"; // Backend URL

function QRCode() {

  const [content, setContent] = useState("");
  const [qrCode, setQRCode] = useState(null);
  const [logoURL, setLogoURL] = useState("");
  const [logoPath, setLogoPath] = useState("");
  const [foreColor, setForeColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [loading, setLoading] = useState(false);

  async function handleGenerateQRCode(){
    const formData = new FormData();
    if(content.length==0){
        toast.error("Content is required!");
        return;
    }
    setLoading(true);
    try{
        formData.append("content", content);
        if(logoPath && logoURL)
          alert("Please select either a logo file or a logo URL, but not both.");
        else if(logoURL)
          formData.append("logo", logoURL);
        else if(logoPath)
          formData.append("logo", logoPath);
        formData.append("dark", foreColor);
        formData.append("light", bgColor);

        const res = await axios.post(`${API_BASE_URL}/generateqr`,
          formData,
          {
            responseType: "arraybuffer",
          }
        );
        const blob = new Blob([res.data],{type: "image/jpeg"});
        setQRCode(URL.createObjectURL(blob));
    }
    catch(err){
        console.log(err);
    }
    finally{
      setLoading(false);
    }
  }

  function handleFileUpload(e){
    const file = e.target.files[0];
    setLogoPath(file);
  }

  return (
    <div className="w-full min-h-screen sm:max-h-screen font-sans">
      <div className="content-area w-full flex flex-col justify-evenly items-center py-10 h-1/4 gap-4">
        <div className="border border-white rounded-full flex items-center justify-center px-6">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter Content"
            className="sm:w-[28vw] h-[9vh] rounded-full p-2 bg-transparent outline-none"
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
            onClick={() => setContent("")}
            className="lucide lucide-circle-x cursor-pointer"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <button
          className="px-10 py-4 rounded-full cursor-pointer border-0 bg-purple-600 shadow-md tracking-wider uppercase text-sm transition-all duration-500 ease-in-out hover:tracking-widest hover:bg-purple-600 hover:text-white hover:shadow-[0_7px_29px_0_rgba(93,24,220,1)] active:translate-y-2 active:transition-[100ms]"
          onClick={handleGenerateQRCode}
        >
          Generate QR Code
        </button>
      </div>
      <div className="qrbox w-full h-3/4 flex flex-col sm:flex-row justify-evenly items-center gap-5 sm:gap-0">
        {/* Logo and Color Selection */}
        <div className="choose-box flex flex-row sm:flex-col justify-evenly items-center border border-white shadow-md shadow-slate-300 p-4 py-8 bg-[#111827] rounded-full h-[12vh] w-[70vw] sm:h-[20vw] sm:w-[5vw]">
          {/* <input
            type="url"
            value={logoURL}
            onChange={(e) => setLogoURL(e.target.value)}
            placeholder="Enter Logo URL"
          /> */}
          <div className="relative group">
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full"
            >
              <img
                src={logo}
                alt="Upload Icon"
                className="border border-white rounded-full"
              />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Tooltip */}
            <div className="absolute top-2 right-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Upload Logo
            </div>
          </div>

          <div className="relative group foreground-color w-[40px] h-[40px] sm:w-[42px] sm:h-[42px]">
            {/* Custom Circle */}
            <div
              className="w-full h-full rounded-full border border-white"
              style={{ backgroundColor: foreColor }}
            ></div>

            {/* Hidden Input */}
            <input
              type="color"
              value={foreColor}
              onChange={(e) => setForeColor(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Tooltip */}
            <div className="absolute top-2 right-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              QR Color
            </div>
          </div>
          <div className="relative group background-color w-[40px] h-[40px] sm:w-[42px] sm:h-[42px]">
            {/* Custom Circle */}
            <div
              className="w-full h-full rounded-full border border-white"
              style={{ backgroundColor: bgColor }}
            ></div>

            {/* Hidden Input */}
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Tooltip */}
            <div className="absolute top-2 right-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Bg Color
            </div>
          </div>
        </div>

        {/* QR Code Display */}
        <div className="w-1/4 flex flex-col items-center md:items-end">
          <div className="w-[15rem] h-[15rem] sm:w-[20rem] sm:h-[20rem] bg-gray-800 rounded-lg flex justify-center items-center">
            {loading ? (
              <div className="loader">
                <div className="square" id="sq1"></div>
                <div className="square" id="sq2"></div>
                <div className="square" id="sq3"></div>
                <div className="square" id="sq4"></div>
                <div className="square" id="sq5"></div>
                <div className="square" id="sq6"></div>
                <div className="square" id="sq7"></div>
                <div className="square" id="sq8"></div>
                <div className="square" id="sq9"></div>
              </div>
            ) : (
              <div>
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" className="w-full h-full" />
                ) : (
                  <p className=" text-gray-400 text-center">Your QR Code will appear here</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        <div className="flex sm:flex-col flex-wrap justify-center gap-3 mt-4">
          <a
            href={qrCode}
            download={`qrcode.png`}
            className="bg-gray-700 px-4 py-2 rounded-lg text-md hover:bg-gray-600"
          >
            Download QRCode
          </a>
        </div>
      </div>
    </div>
  );
}

export default QRCode