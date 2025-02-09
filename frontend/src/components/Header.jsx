import React, { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false); // State for menu toggle

  return (
    <>
      <nav className="fixed z-20 top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-4 backdrop-blur-xl">
        <Link to="/" className="logo">
          Tiny Tag
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <span className="text-3xl">✕</span> // Close icon
          ) : (
            <span className="text-3xl">☰</span> // Hamburger icon
          )}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/qrcode" className="animated-link">
            Generate QR
          </Link>
          <Link to="/shorturl" className="animated-link">
            Short URL
          </Link>
        </div>
      </nav>

      {/* Full-Screen Mobile Menu */}
      <div
        className={`fixed inset-0 backdrop-blur-xl z-10 flex flex-col items-center justify-center transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <Link
          to="/qrcode"
          className="animated-link text-2xl mb-6"
          onClick={() => setIsOpen(false)}
        >
          Generate QR
        </Link>
        <Link
          to="/shorturl"
          className="animated-link text-2xl"
          onClick={() => setIsOpen(false)}
        >
          Short URL
        </Link>
      </div>
    </>
  );
}

export default Header;
