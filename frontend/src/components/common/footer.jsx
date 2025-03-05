import React, { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-darkCard py-10">
      <div className="container mx-auto px-4">
        <DarkModeToggle />
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold">Company</h3>
              <ul className="mt-2">
                <li className="mt-2">
                  <a href="#">About Us</a>
                </li>
                <li className="mt-2">
                  <a href="#">Contact Us</a>
                </li>
                <li className="mt-2">
                  <a href="#">Careers</a>
                </li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold">Support</h3>
              <ul className="mt-2">
                <li className="mt-2">
                  <a href="#">Help & Support</a>
                </li>
                <li className="mt-2">
                  <a href="#">Privacy Policy</a>
                </li>
                <li className="mt-2">
                  <a href="#">Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <h3 className="text-xl font-bold">Subscribe to our newsletter</h3>
            <form className="mt-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2 dark:bg-darkBg dark:border-gray-500 rounded-md"
              />
              <button className="w-full mt-2 bg-blue-500 text-white p-2 rounded-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <hr className="my-8 border-gray-300" />
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="text-center md:text-left">
            <p>&copy; 2021 All rights reserved.</p>
          </div>
          <div className="text-center md:text-right">
            <ul className="flex justify-center md:justify-end space-x-4">
              <li>
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "dark");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full transition-all bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};
