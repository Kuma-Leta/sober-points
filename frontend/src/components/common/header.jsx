import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import blackLogo from "../../assets/images/SP-Main-Logo-Black.png";
import MobileLogo from "../../assets/images/Logo-Black.png";
import {
  FaUser,
  FaBars,
  FaTimes,
  FaPlus,
  FaRegHeart,
  FaHome,
} from "react-icons/fa";
import defaultUserProfile from "../../assets/images/user.png";
import { BiPlusCircle } from "react-icons/bi";

const Header = () => {
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu
  const dropdownRef = useRef(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
    <header className="bg-white dark:bg-darkCard dark:text-darkText w-full shadow-sm ">
      {/* Full-width container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3 sm:py-3">
        {/* Mobile Menu Button */}

        {/* Logo */}
        <div className="flex items-center space-x-3 lg:space-x-10">
          {/* Logo */}
          <Link to="/">
            {/* Black logo for light mode, white logo for dark mode */}
            <img
              src={blackLogo}
              alt="Sober Points Logo"
              className="w-36 md:block hidden h-auto dark:hidden" // Show in light mode
            />
            <img
              src={MobileLogo}
              alt="Sober Points Logo"
              className="h-8 md:hidden h- dark:hidden" // Show in light mode
            />
          </Link>

          {/* Navigation Links (Desktop) - Conditionally rendered for non-admin users */}
          {user?.role !== "admin" && (
            <nav className="hidden sm:flex space-x-4  dark:text-darkText text-sm font-semi-bold">
              <Link
                to="/venues/nearby"
                className="hover:text-primary transition"
              >
                Map
              </Link>

              <Link to="/a" className="hover:text-primary transition">
                About
              </Link>
              <Link to="/blogs" className="hover:text-primary transition">
                Blog
              </Link>
              <Link to="/contact" className="hover:text-primary transition">
                Contact
              </Link>
            </nav>
          )}
        </div>

        {/* Auth & Dark Mode Toggle */}
        <div className="flex items-center space-x-3">
          {/* <DarkModeToggle /> */}

          {isAuthenticated ? (
            <div className="relative flex flex-start items-center space-x-3">
              {/* Post Venue Button */}
              {user?.role !== "admin" && (
                <Link
                  to="/venue/form"
                  className="hidden sm:flex bg-primary hover:bg-primaryLight text-white px-3 py-1 rounded-md items-center space-x-1 text-sm transition"
                >
                  <BiPlusCircle />
                  <span>Contribute</span>
                </Link>
              )}

              {/* User Dropdown */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2"
              >
                <img
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-grayColor dark:border-darkText"
                  src={
                    user?.profilePicture
                      ? `${import.meta.env.VITE_API_URL}/${user.profilePicture}`
                      : defaultUserProfile
                  }
                  alt="User"
                />
                {/* Always show the name for admin users */}
                {(user?.role === "admin" || dropdownOpen) && (
                  <span className="text-sm text-grayColor dark:text-darkText">
                    {user?.name || user?.username}
                  </span>
                )}
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
                  <Link
                    to="/favorites"
                    className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <FaRegHeart className="inline mr-2" /> my favorites
                  </Link>
                  {user?.role !== "admin" && (
                    <Link
                      onClick={() => setDropdownOpen(false)}
                      to="/my-venue" // Update the link to your venue page
                      className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <FaHome className="inline mr-2" /> My Venue
                    </Link>
                  )}
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
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
                to="/howToContribute"
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary-dark transition"
              >
                Join
              </Link>
              <Link
                to="/auth/login"
                className="border border-primary text-primary px-2 py-2 rounded-md text-sm font-semibold hover:bg-primary hover:text-white transition"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="text-grayColor dark:text-darkText sm:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      {/* Sidebar for Mobile */}
      {sidebarOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar - Changed from left-0 to right-0 */}
          <div className="fixed inset-y-0 right-0 w-64 bg-white dark:bg-darkCard shadow-lg z-50 sm:hidden">
            <div className="p-4">
              {/* Close Button */}
              <button
                className="text-grayColor dark:text-darkText mb-4"
                onClick={() => setSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>

              {/* Rest of the sidebar content remains exactly the same */}
              <nav className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  Blog
                </Link>
                <Link
                  to="#features"
                  className="text-grayColor dark:text-darkText hover:text-primary transition"
                  onClick={() => setSidebarOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="#services"
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

              {isAuthenticated && (
                <div className="mt-6">
                  <div className="flex items-center space-x-2">
                    <img
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-grayColor dark:border-darkText"
                      src={
                        user?.profilePicture
                          ? `${import.meta.env.VITE_API_URL}/${
                              user.profilePicture
                            }`
                          : defaultUserProfile
                      }
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
                    <Link
                      to="/favorites"
                      className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <FaRegHeart className="inline mr-2" /> my favorites
                    </Link>

                    <button
                      onClick={() => {
                        setShowLogoutConfirm(true);
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
      {showLogoutConfirm && (
        <LogoutConfirmationModal
          onConfirm={() => {
            logout();
            setShowLogoutConfirm(false);
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </header>
  );
};

export default Header;

const LogoutConfirmationModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-lg w-80 text-center">
        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to log out?
        </p>
        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

function Avatar() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const user = useSelector((state) => state.auth.user);
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
    <>
      {showLogoutConfirm && (
        <LogoutConfirmationModal
          onConfirm={() => {
            logout();
            setShowLogoutConfirm(false);
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center space-x-2"
      >
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-grayColor dark:border-darkText"
          src={
            user?.profilePicture
              ? `${import.meta.env.VITE_API_URL}/${user.profilePicture}`
              : defaultUserProfile
          }
          alt="User"
        />
        <span className="text-sm text-grayColor dark:text-darkText">
          {user?.name || user?.username}
        </span>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 bottom-0 mt-2 w-40 bg-white dark:bg-darkCard shadow-md rounded-md z-50 text-sm"
        >
          <Link
            onClick={() => setDropdownOpen(false)}
            to="/users/profile"
            className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaUser className="inline mr-2" /> Profile
          </Link>
          <Link
            to="/favorites"
            className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setSidebarOpen(false)}
          >
            <FaRegHeart className="inline mr-2" /> my favorites
          </Link>
          {user?.role !== "admin" && (
            <Link
              onClick={() => setDropdownOpen(false)}
              to="/my-venue" // Update the link to your venue page
              className="block px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FaHome className="inline mr-2" /> My Venue
            </Link>
          )}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="block w-full text-left px-4 py-2 text-grayColor dark:text-darkText hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}
