import React from "react";
import { Routes, Route } from "react-router-dom";
import {Home, QRCode, URLShortener} from "./pages/index";
import {Redirect} from "./components/index";
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
        <Route path="/:shorturl" element={<Redirect />} />
      </Routes>
    </>
  );
}

export default App
