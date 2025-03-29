import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import axiosInstance from "../../api/api";
import MobileLogo from "../../assets/images/Logo-Black.png";

export default function Footer() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/subscriber", { email });
      setMessage(response.data.message);
      setIsError(false);
      setEmail(""); // Clear input after success
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
      setIsError(true);
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <footer className="bg-gray-100 text-black font-sans">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 grid gap-8 sm:grid-cols-2 text-left">
        {/* Left Column: Logo & Navigation */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
            <img
              src={MobileLogo}
              alt="Sober Points Logo"
              className="h-8 dark:hidden" // Show in light mode
            />
          </h3>
          <ul className="mt-4 text-sm grid grid-cols-2 gap-2 md:grid-cols-1 sm:text-base text-gray-600">
            <li>
              <a href="/" className="hover:text-black transition">
                Home
              </a>
            </li>
            <li>
              <a href="/venues/nearby" className="hover:text-black transition">
                Sober Map
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/blogs" className="hover:text-black transition">
                Our Blog
              </a>
            </li>
            <li>
              <a
                href="/howToContribute"
                className="hover:text-black transition"
              >
                Join Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-black transition">
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
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex border border-gray-500 rounded-lg overflow-hidden max-w-md"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full outline-none text-black text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-3 hover:bg-primaryLight transition text-sm sm:text-base border-2 border-black rounded-md hover:border-black"
            >
              Subscribe
            </button>
          </form>

          {/* Message Display */}
          {message && (
            <p
              className={`mt-2 text-sm ${
                isError ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}

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
