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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-darkCard shadow-md z-50 h-16 flex items-center">
    <header className="bg-white dark:bg-darkCard dark:text-darkText w-[100%] shadow-sm flex items-center justify-between px-2 sm:px-6 py-1 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex  items-center  space-x-3 pl-4">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="fixed top-1 left-2 w-10 sm:w-10 md:w-18   h-auto object-contain"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-grayColor dark:text-darkText sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Navigation Links */}
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
                  className="absolute left-0 top-7 mt-2 w-40 bg-white dark:bg-darkCard shadow-md rounded-md z-50 text-sm"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden absolute top-16 left-0 w-full bg-white dark:bg-darkCard shadow-md z-40">
          <nav className="flex flex-col space-y-2 p-4">
            <Link
              to="/"
              className="text-grayColor dark:text-darkText hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="#features"
              className="text-grayColor dark:text-darkText hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="#services"
              className="text-grayColor dark:text-darkText hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              to="#contact"
              className="text-grayColor dark:text-darkText hover:text-primary transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
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
