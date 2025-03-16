import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white text-black">
      {/* Newsletter Section */}
      <div className="bg-black text-white py-10 px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Stay Updated with Our Newsletter
        </h2>
        <p className="mt-2 text-gray-300 max-w-lg mx-auto">
          Subscribe for the latest updates and exclusive insights on
          alcohol-free offerings near you.
        </p>

        {/* Subscription Form */}
        <form className="mt-4 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your Email Here"
            className="w-full p-3 rounded-lg border border-gray-500 text-black focus:outline-none"
          />
          <button className="bg-white text-black font-semibold px-5 py-3 rounded-lg hover:bg-gray-200 transition">
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

      {/* Footer Links Section */}
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Logo & Links */}
        <div>
          <h3 className="text-lg font-semibold">SOBER POINTS</h3>
          <ul className="mt-3 space-y-2 text-gray-600">
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
        <div className="sm:col-span-2">
          <h3 className="text-lg font-semibold">Join Our Community</h3>
          <form className="mt-3 flex border border-gray-500 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full outline-none text-black"
            />
            <button className="bg-black text-white px-5 hover:bg-gray-800 transition">
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

      {/* Footer Bottom Section */}
      <hr className="border-gray-300" />
      <div className="max-w-6xl mx-auto py-4 px-4 sm:px-6 flex flex-col sm:flex-row justify-between text-sm text-gray-600">
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
        <p className="mt-2 sm:mt-0">&copy; 2025 Relume. All rights reserved.</p>
      </div>
    </footer>
  );
}
