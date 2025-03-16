import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      {/* Newsletter Section */}
      <div className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mt-2 text-gray-300">
            Subscribe for the latest updates and exclusive insights on
            alcohol-free offerings near you.
          </p>

          {/* Subscription Form */}
          <form className="mt-4 flex flex-col md:flex-row md:items-center gap-3">
            <input
              type="email"
              placeholder="Your Email Here"
              className="w-full md:w-2/3 p-3 rounded-md border border-gray-400 text-black"
            />
            <button className="bg-white text-black font-semibold px-5 py-3 rounded-md hover:bg-gray-200 transition">
              Join Now
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-2">
            By clicking Join Now, you agree to our{" "}
            <a href="#" className="underline">
              Terms and Conditions
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer Links Section */}
      <div className="max-w-6xl mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Logo & Links */}
          <div>
            <h3 className="text-lg font-bold">SOBER POINTS</h3>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>
                <a href="#" className="hover:text-black">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Our Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Subscription Form in Footer */}
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-bold">Join</h3>
            <form className="mt-2 flex border border-gray-400 rounded-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 w-full outline-none"
              />
              <button className="bg-black text-white px-4 hover:bg-gray-800 transition">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-600 mt-2">
              By subscribing, you agree to our{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <hr className="border-gray-300" />
      <div className="max-w-6xl mx-auto py-4 px-6 flex flex-col md:flex-row justify-between text-sm text-gray-600">
        <div className="flex space-x-4">
          <a href="#" className="hover:text-black">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black">
            Terms of Service
          </a>
          <a href="#" className="hover:text-black">
            Cookies Settings
          </a>
        </div>
        <p>&copy; 2025 Relume. All rights reserved.</p>
      </div>
    </footer>
  );
}
