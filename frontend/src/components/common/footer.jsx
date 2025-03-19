import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-black font-sans">
      {/* Newsletter Section */}
      <div className="bg-black text-white py-12 sm:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Stay Updated with Our Newsletter
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            Subscribe for the latest updates and exclusive insights on
            alcohol-free offerings near you.
          </p>

          {/* Subscription Form */}
          <form className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your Email Here"
              className="w-full p-3 rounded-lg border border-gray-500 text-black 
                         focus:outline-none text-sm sm:text-base"
            />
            <button
              type="submit"
              className="bg-white text-black font-semibold px-4 sm:px-2 py-2 sm:py-2 
                         rounded-lg hover:bg-gray-200 transition text-sm sm:text-base"
            >
              Join Now
            </button>
          </form>

          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            By clicking Join Now, you agree to our{" "}
            <a href="#" className="underline hover:text-gray-200 transition">
              Terms and Conditions
            </a>
            .
          </p>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Left Column: Logo & Links */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-wide">
            SOBER POINTS
          </h3>
          <ul className="mt-4 text-sm grid grid-cols-2 gap-2 md:grid-cols-1 sm:text-base text-gray-600">
            <li>
              <a href="#" className="hover:text-black transition">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Our Blog
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-black transition">
                Get Started
              </a>
            </li>
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
          <a href="#" className="hover:text-black transition">
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
