import React from "react";
import { Routes, Route } from "react-router-dom";
import Home  from "./pages/Home";
import QRCode from "./pages/QRCode";
import { GenerateQR } from "./components";

function App() {

  return (
    <>
      {/* <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
        <div className="max-w-7xl mx-auto p-6">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-cyan-400 mb-4">TinyTags</h1>
            <p className="text-lg text-gray-300">
              Simplify your links and generate QR codes with ease.
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <URLShortener />
            <GenerateQR />
          </main>
        </div>
      </div> */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="/qrcode" element={<QRCode />} />
        <Route path="/sampleqr" element={<GenerateQR />} />
      </Routes>
    </>
  );
}

export default App
