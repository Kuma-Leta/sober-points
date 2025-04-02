import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import axiosInstance from "../../api/api";
import MobileLogo from "../../assets/images/Logo-Black.png";
import { FaInstagram, FaFacebook } from "react-icons/fa";

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
    <footer
      className={`bg-gray-100  w-full text-black font-sans ${
        isAuthenticated ? "p-[32px] pb-32 md:p-[64px]" : "p-[32px] md:p-[64px]"
      }`}
    >
      <div className="max-w-[1312px] mx-auto">
        <div className=" mx-auto px-[20px] py-[48px] sm:p-[48px] w-full grid gap-[48px] md:gap-[128px] grid-cols-1 lg:grid-cols-[3fr_1fr_1fr]">
          {/* Left Column: Logo & Navigation */}
          <div className="flex w-full flex-col gap-4">
            <h3 className="text-2xl sm:text-3xl font-extrabold cursor-pointer tracking-wide">
              <img
                src={MobileLogo}
                alt="Sober Points Logo"
                className="h-10 dark:hidden"
              />
            </h3>
            <p className="text-base sm:text-lg  text-black">
              Subscribe to our newsletter for the latest updates on features and
              releases.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex flex-col w-full sm:flex-row items-center overflow-hidden"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="p-2 border w-full outline-none text-black text-base  border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-primary text-white px-5 py-2 hover:bg-primaryLight transition text-base sm:text-lg font-medium sm:ml-3 mt-3 sm:mt-0 w-full sm:w-auto"
              >
                Subscribe
              </button>
            </form>

            {message && (
              <p
                className={`mt-2 text-sm ${
                  isError ? "text-red-500" : "text-green-500"
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-base text-black">
              By subscribing, you consent to our Privacy Policy and agree to
              receive updates.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-1">Quick Links</h3>
            <ul className="mt-4 text-sm grid gap-2 md:grid-cols-1 sm:text-base text-black">
              <li>
                <a
                  href="/venues/nearby"
                  className="hover:text-black transition"
                >
                  Sober Map
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-black transition">
                  About
                </a>
              </li>
              <li>
                <a href="/blogs" className="hover:text-black transition">
                  Our Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-black transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <h3 className="text-lg font-medium mb-1">Stay Connected</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.instagram.com/wearesoberpoints/"
                target="_blank"
                className="flex items-center gap-2 text-black hover:text-black transition-colors text-lg"
              >
                <FaInstagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61568414595086"
                target="_blank"
                className="flex items-center gap-2 text-black hover:text-black transition-colors text-lg"
              >
                <FaFacebook className="w-5 h-5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-600 my-[32px] w-full" />

        <div className="flex-col-reverse flex sm:flex-row justify-between items-start text-xs sm:text-sm text-gray-600 text-left">
          <p className="mt-2 sm:mt-0">
            &copy; 2025 Sober Points. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0">
            <a
              href="/privacyPolicy"
              className="hover:text-black underline transition"
            >
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black underline transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-black underline transition">
              Cookies Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
