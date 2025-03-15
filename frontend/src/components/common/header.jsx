import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import { FaUser, FaBars, FaTimes, FaPlus } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import defaultUserProfile from "../../assets/images/user.png";

const Header = () => {
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white dark:bg-darkCard dark:text-darkText w-full shadow-sm fixed top-0 z-50">
      {/* Full-width container for smaller screens */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img
              src={logo}
              alt="Sober Points Logo"
              className="w-16 sm:w-20 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-grayColor dark:text-darkText sm:hidden "
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden sm:flex space-x-4 text-grayColor dark:text-darkText text-sm font-medium">
          <Link to="/" className="hover:text-primary transition">
            Home
          </Link>
          <Link to="#features" className="hover:text-primary transition">
            Features
          </Link>
          <Link to="#services" className="hover:text-primary transition">
            Services
          </Link>
          <Link to="#contact" className="hover:text-primary transition">
            Contact
          </Link>
        </nav>

        {/* Auth & Dark Mode Toggle */}
        <div className="flex items-center space-x-3">
          <DarkModeToggle />

          {isAuthenticated ? (
            <div className="relative flex items-center space-x-2">
              {/* Post Venue Button */}
              <Link
                to="/venue/form"
                className="hidden sm:flex bg-primary hover:bg-primaryLight text-white px-3 py-1 rounded-md items-center space-x-1 text-sm transition"
              >
                <FaPlus />
                <span>Post Venue</span>
              </Link>

              {/* User Dropdown */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-grayColor dark:border-darkText"
                  src={user?.profilePicture || defaultUserProfile}
                  alt="User"
                />
                <span className="text-sm text-grayColor dark:text-darkText">
                  {user?.name || user?.username}
                </span>
              </button>
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 top-10 mt-2 w-40 bg-white dark:bg-darkCard shadow-md rounded-md z-50 text-sm"
                >
                  <Link
                    onClick={() => setDropdownOpen(false)}
                    to="/users/profile"
                    className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <FaUser className="inline mr-2" /> Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link
                to="/auth/login"
                className="border border-primary text-primary px-3 py-1 rounded-md hover:bg-primary hover:text-white text-sm transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-1/2 bg-white dark:bg-darkCard shadow-lg z-50 sm:hidden">
            <div className="p-4">
              {/* Close Button */}
              <button
                className="text-grayColor dark:text-darkText mb-4"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="#features"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  Features
                </Link>
                <Link
                  to="#services"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="#contact"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  Contact
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/venue/form"
                    className="text-grayColor dark:text-darkText hover:text-primary transition"
                    onClick={() => setSidebarOpen(false)}
                  >
                    Post Venue
                  </Link>
                )}
              </nav>

              {/* User Dropdown (Mobile) */}
              {isAuthenticated && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <img
                      className="w-8 h-8 rounded-full object-cover border border-grayColor dark:border-darkText"
                      src={user?.profilePicture || defaultUserProfile}
                      alt="User"
                    />
                    <span className="text-sm text-grayColor dark:text-darkText">
                      {user?.name || user?.username}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/users/profile"
                      className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setSidebarOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;

/* Dark Mode Toggle */
const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches &&
        localStorage.getItem("theme") !== "light")
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full transition-all bg-gray-200 dark:bg-gray-700"
    >
      {darkMode ? (
        <FiSun size={16} className="text-primary" />
      ) : (
        <FiMoon size={16} className="text-primary" />
      )}
    </button>
  );
};
