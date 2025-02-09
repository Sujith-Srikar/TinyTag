import React from "react";
import {
  Link2,
  QrCode,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Github,
  Twitter,
} from "lucide-react";
import Spotlight from "../animations/SpotlightCard/SpotlightCard";

function Features() {
  return (
    <>
      <div className=" text-gray-100">
        {/* Navigation */}
        {/* <div className="fixed w-full z-50 bg-gray-950/50 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <Link2 className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-violet-400 text-transparent bg-clip-text">
                  TinyTag
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="#" className="nav-link group">
                  <Link2 className="w-4 h-4 mr-1" />
                  Short URL
                  <span className="nav-link-underline" />
                </a>
                <a href="#" className="nav-link group">
                  <QrCode className="w-4 h-4 mr-1" />
                  QR Code
                  <span className="nav-link-underline" />
                </a>
                <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 transition-all duration-300 font-medium shadow-lg shadow-purple-500/25">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div> */}
        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-purple-400" />,
                  title: "Lightning Fast",
                  description:
                    "Generate short URLs and QR codes in milliseconds",
                },
                {
                  icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
                  title: "Analytics",
                  description: "Track clicks and engagement in real-time",
                },
                {
                  icon: <QrCode className="w-6 h-6 text-violet-400" />,
                  title: "QR Codes",
                  description: "Generate custom QR codes for any URL",
                },
                {
                  icon: <Link2 className="w-6 h-6 text-violet-400" />,
                  title: "Custom URLs",
                  description: "Create branded short links with custom slugs",
                },
              ].map((feature, index) => (
                <Spotlight key={index} spotlightColor="rgba(200, 100, 255, 0.2)">
                  <div
                    key={index}
                    className="feature-card group p-6 rounded-xl transition-all duration-300"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="mb-4 p-2 rounded-lg  transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-purple-400 to-violet-400 text-transparent bg-clip-text">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Link2 className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-violet-400 text-transparent bg-clip-text">
                TinyTag
              </span>
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-center space-x-6">
              <a
                href="https://github.com/Sujith-Srikar/TinyTag"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <span className="text-gray-500">© 2025 TinyTag.</span>
              <span className="text-gray-500">All rights reserved.</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Features;
