import React from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-darkCard py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Company & Support & Newsletter */}
        <div className="flex flex-col space-y-6 md:flex-row md:justify-between md:space-y-0">
          {/* Company & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6 sm:flex-row sm:space-x-12 sm:space-y-0"
          >
            <div>
              <h3 className="text-lg font-bold text-grayColor dark:text-darkText">
                Company
              </h3>
              <ul className="mt-2 space-y-1 text-grayColor dark:text-darkText">
                <li className="hover:text-primary transition">
                  <a href="#">About Us</a>
                </li>
                <li className="hover:text-primary transition">
                  <a href="#">Contact Us</a>
                </li>
                <li className="hover:text-primary transition">
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-grayColor dark:text-darkText">
                Support
              </h3>
              <ul className="mt-2 space-y-1 text-grayColor dark:text-darkText">
                <li className="hover:text-primary transition">
                  <a href="#">Help & Support</a>
                </li>
                <li className="hover:text-primary transition">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="hover:text-primary transition">
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
            className="w-full md:w-auto"
          >
            <h3 className="text-lg font-bold text-grayColor dark:text-darkText">
              Subscribe to Our Newsletter
            </h3>
            <form className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 rounded-md bg-white dark:bg-darkBg dark:text-darkText border border-grayColor dark:border-darkText focus:border-primary outline-none"
              />
              <button className="bg-primary hover:bg-primaryLight text-white px-4 py-2 rounded-md transition">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-grayColor dark:border-darkText" />

        {/* Bottom Section */}
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center md:space-y-0">
          <p className="text-sm text-grayColor dark:text-darkText text-center md:text-left">
            &copy; {new Date().getFullYear()} Sober Points. All rights reserved.
          </p>

          {/* Social Media Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex space-x-4 justify-center md:justify-start"
          >
            <a
              href="#"
              className="text-grayColor dark:text-darkText hover:text-primary transition text-lg"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="text-grayColor dark:text-darkText hover:text-primary transition text-lg"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="text-grayColor dark:text-darkText hover:text-primary transition text-lg"
            >
              <FaInstagram />
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
