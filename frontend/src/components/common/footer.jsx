import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-darkCard py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Company & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:space-x-12"
          >
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Company
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
                <li className="hover:text-red-600 transition">
                  <a href="#">About Us</a>
                </li>
                <li className="hover:text-red-600 transition">
                  <a href="#">Contact Us</a>
                </li>
                <li className="hover:text-red-600 transition">
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Support
              </h3>
              <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-300">
                <li className="hover:text-red-600 transition">
                  <a href="#">Help & Support</a>
                </li>
                <li className="hover:text-red-600 transition">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="hover:text-red-600 transition">
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Newsletter Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 md:mt-0"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Subscribe to Our Newsletter
            </h3>
            <form className="mt-3 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 rounded-l-md dark:bg-darkBg dark:text-gray-300 border border-gray-300 dark:border-gray-600 focus:border-red-500 outline-none"
              />
              <button className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 rounded-r-md transition">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-300 dark:border-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-center md:text-left">
            &copy; {new Date().getFullYear()} Sober Points. All rights reserved.
          </p>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex space-x-4 mt-4 md:mt-0"
          >
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition text-xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition text-xl"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-300 hover:text-red-600 transition text-xl"
            >
              <FaInstagram />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
