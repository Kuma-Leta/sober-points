import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import blackLogo from "../../assets/images/Logo-Black.png";

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gray-100 text-black font-sans">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 grid gap-8 sm:grid-cols-2 text-left">
        {/* Left Column: Logo & Navigation */}
        <div>
          <img src={blackLogo} alt="logo" className="w-20 h-20 mb-4" />
          <ul className="text-sm  grid md:flex  md:flex-wrap   gap-3 sm:text-base text-gray-600">
            <li>
              <a href="/#aboutus" className="hover:text-black transition">
                Sober Map
              </a>
            </li>
            <li>
              <a href="/#contactus" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/blogs" className="hover:text-black transition">
                Our Blog
              </a>
            </li>
            <li>
              <a href="/#FAQ" className="hover:text-black transition">
                Join Us
              </a>
            </li>
            <li>
              <a href="/#FAQ" className="hover:text-black transition">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Right Column: Newsletter Signup */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">
            Sign up for our newsletter
          </h3>
          <form className="mt-4 flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full outline-none border border-black text-black text-sm sm:text-base rounded-md focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-3 hover:bg-primaryLight transition text-sm sm:text-base border-2 border-black rounded-md hover:border-black"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            By subscribing, you agree to our{" "}
            <a href="#" className="underline hover:text-black transition">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <hr className="border-gray-300 my-4" />
      <div className="max-w-6xl mx-auto   px-4 sm:py-6 flex flex-col sm:flex-row justify-between items-start text-xs sm:text-sm text-gray-600 text-left">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <a href="/privacyPolicy" className="hover:text-black transition">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-black transition">
            Terms of Service
          </a>
          <a href="#" className="hover:text-black transition">
            Cookies Settings
          </a>
        </div>
        <p className="mt-2 sm:mt-0">
          &copy; 2025 Sober Points. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
