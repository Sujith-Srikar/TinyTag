import React from "react";
import { Routes, Route } from "react-router-dom";
import {Home, QRCode, URLShortener} from "./pages/index";
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <div>
        <Toaster />
      </div>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/qrcode" element={<QRCode />} />
        <Route path="/shorturl" element={<URLShortener />} />
      </Routes>
    </>
  );
}

export default App
