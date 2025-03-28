import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaHeart, FaSearch, FaMapMarkerAlt, FaUser, FaRegHeart, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

const BottomNavBar = () => {
  const location = useLocation();

  // Define the navigation items
  const navItems = [
    { icon: <FaPlus size={20} />, path: "/venue/form", label: "Add" },
    { icon: <FaHeart size={20} />, path: "/favorites", label: "Favorites" },
    { icon: <FaSearch size={20} />, path: "/#explore", label: "Explore" },
    {
      icon: <FaMapMarkerAlt size={20} />,
      path: "/venues/nearby",
      label: "Nearby",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around items-center p-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center text-gray-600 hover:text-primary transition-colors ${
              location.pathname === item.path ? "text-primary" : ""
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        <Avatar />
      </div>
    </div>
  );
};

export default BottomNavBar;
import defaultUserProfile from "../../assets/images/user.png";
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
        className="flex flex-col items-center space-x-2"
      >
        <img
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-grayColor dark:border-darkText"
          src={user?.profilePicture || defaultUserProfile}
          alt="User"
        />
        <span className="text-sm text-grayColor dark:text-darkText">
          {user?.name.slice(0,6) || user?.username}
        </span>
      </button>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 bottom-10 mt-2 w-40 bg-white dark:bg-darkCard shadow-md rounded-md z-50 text-sm"
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
