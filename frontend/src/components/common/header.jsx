import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import { BsSearch } from "react-icons/bs";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import defaultUserProfile from "../../assets/images/user.png";
const Header = () => {
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    <header className="fixed top-0 left-0 w-full bg-white dark:bg-darkCard shadow-md z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-2">
        {/* Mobile Menu Button */}
        <button
          className="text-gray-700 dark:text-darkText sm:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src={logo}
              alt="Sober Points Logo"
              className="w-20 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden sm:flex space-x-6 text-gray-700 dark:text-darkText text-sm font-medium">
          <Link to="/" className="hover:text-red-600 transition">
            Home
          </Link>
          <Link to="#features" className="hover:text-red-600 transition">
            Features
          </Link>
          <Link to="#services" className="hover:text-red-600 transition">
            Services
          </Link>
          <Link to="#contact" className="hover:text-red-600 transition">
            Contact
          </Link>
        </nav>

        {/* Auth & Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          <DarkModeToggle />

          {isAuthenticated ? (
            <div className="relative">
              <Link
                to={"/venue/form"}
                className="bg-primary hover:bg-opacity-80 p-2 py-1 text-white  rounded-lg"
              >
                Post Venue
              </Link>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  className="w-7 h-7 rounded-full object-cover"
                  src={user?.profilePicture || defaultUserProfile}
                  alt="User"
                />
                <span className="text-sm">{user?.name || user?.username}</span>
              </button>

              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50 text-sm"
                >
                  <Link
                    onClick={() => setDropdownOpen(false)}
                    to="/users/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FaUser className="inline mr-2" /> Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
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
                className="border border-red-600 text-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white text-sm"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-darkCard shadow-md p-4">
          <nav className="flex flex-col space-y-3 text-center">
            <Link to="/" className="text-gray-700 dark:text-darkText">
              Home
            </Link>
            <Link to="#features" className="text-gray-700 dark:text-darkText">
              Features
            </Link>
            <Link to="#services" className="text-gray-700 dark:text-darkText">
              Services
            </Link>
            <Link to="#contact" className="text-gray-700 dark:text-darkText">
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
      {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
};
