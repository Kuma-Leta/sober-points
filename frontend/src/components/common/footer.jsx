import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  return (
    <footer className="bg-gray-70 text-black font-sans">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Left Column: Logo & Links */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
            SOBER POINTS
          </h3>
          <ul className="mt-4 text-sm grid grid-cols-2 gap-2 md:grid-cols-1 sm:text-base text-gray-600">
            <li>
              <a href="/#aboutus" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/#contactus" className="hover:text-black transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Our Blog
              </a>
            </li>
            <li>
              <a href="/#FAQ" className="hover:text-black transition">
                FAQs
              </a>
            </li>
            {!isAuthenticated && (
              <li>
                <a href="/auth/login" className="hover:text-black transition">
                  Get Started
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Right Columns: Subscription Form */}
        <div className="sm:col-span-2">
          <h3 className="text-lg sm:text-xl font-semibold">
            Join Our Community
          </h3>
          <form className="mt-4 flex border border-gray-500 rounded-lg overflow-hidden max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full outline-none text-black text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 sm:px-5 hover:bg-gray-800 transition text-sm sm:text-base"
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
      <hr className="border-gray-300" />
      <div
        className="max-w-6xl mx-auto py-4 px-4 sm:px-6 flex flex-col sm:flex-row 
                      justify-between items-start sm:items-center text-xs sm:text-sm text-gray-600"
      >
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
        <p className="mt-2 sm:mt-0 text-gray-600">
          &copy; 2025 Relume. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
