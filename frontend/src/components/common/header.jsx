import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { RxDashboard } from "react-icons/rx";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.jpg";
import { getProfilePicUrl } from "../../utils/functions";
import { BsSearch } from "react-icons/bs";
import { FaAngleRight, FaUser } from "react-icons/fa6";
import { API_URL } from "../../constants/url";
import { FiSun, FiMoon } from "react-icons/fi";

const Header = () => {
  const { logout } = useAuth();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    window.location.href = "/auth/logout";
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const user = useSelector((state) => state.auth.user);

  const location = useLocation();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile if width <= 768px
    };
    handleResize(); // Set initial screen size
    window.addEventListener("resize", handleResize); // Update on resize

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className=" ">
      <div className="bg-white dark:bg-darkCard dark:text-darkText w-[100%] shadow-sm flex items-center justify-between px-2 sm:px-6 py-1 z-10">
        <DarkModeToggle />
        <div className="flex w-full items-center justify-end space-x-2 sm:space-x-4 p-2 relative">
          {!isAuthenticated && (
            <ul className="flex space-x-4">
              <li>
                <a href="#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          )}
          {isAuthenticated && <div>{user?.company?.name}</div>}
          <button className="flex items-center space-x-2 focus:outline-none">
            {isAuthenticated ? (
              <div className="flex items-center gap-1" onClick={toggleDropdown}>
                <Link
                  to={"/venue/form"}
                  className="bg-primary hover:bg-opacity-80 p-2 py-1 text-white  rounded-lg"
                >
                  Post Venue
                </Link>
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={getProfilePicUrl(user?.profilePicture)}
                />
                <span>
                  {user?.name
                    ? user?.name?.length > 20
                      ? `${user.name.slice(0, 20)}...`
                      : user?.name
                    : user?.username}
                </span>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to={"/auth/register"}
                  className="bg-primary hover:bg-opacity-80 p-2 py-1 text-white  rounded-lg"
                >
                  sign up for free
                </Link>

                <Link
                  to={"/auth/login"}
                  className="bg-ternary hover:bg-opacity-80 p-2 py-1 text-white rounded-lg"
                >
                  login
                </Link>
              </div>
            )}
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-full border right-0 mt-2 px-2 w-48 bg-white shadow-md rounded-md z-50"
            >
              <Link
                onClick={() => setDropdownOpen(false)}
                to={"/users/profile"}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-gray-900 p-2 rounded-lg cursor-pointer text-gray-700"
              >
                <FaUser />
                Profile
              </Link>
              <Link
                onClick={() => setDropdownOpen(false)}
                to={`/${user?.role}s/${user?.username}`}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-300 hover:text-gray-900 p-2 rounded-lg cursor-pointer text-gray-700"
              >
                <RxDashboard /> Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

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
      {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
    </button>
  );
};
