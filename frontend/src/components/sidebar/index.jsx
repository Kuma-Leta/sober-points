import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { TfiBarChart } from "react-icons/tfi";
import { useSelector } from "react-redux";
import {
  FaBuilding,
  FaBars,
  FaUsers,
  FaChevronLeft,
  FaProjectDiagram,
} from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { getProfilePicUrl } from "../../utils/functions";
import { IoSettingsOutline } from "react-icons/io5";
import { API_URL } from "../../constants/url";
import { IoMdClose } from "react-icons/io";

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const [isSidebarOpen, setSidebarOpen] = useState(
    localStorage.getItem("sidebarOpen") === "true"
  );
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    localStorage.setItem("sidebarOpen", !isSidebarOpen);
  };
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const menuItems = [
    {
      icon: <TfiBarChart className="text-lg" />,
      label: "Dashboard",
      path: "/admin-analytics",
    },

    ...(user?.role === "admin"
      ? [
          {
            icon: <FaUsers className="text-lg" />,
            label: "Users",
            path: "/users",
          },
          {
            icon: <FaBuilding className="text-lg" />,
            label: "Venues",
            path: "/venues",
          },
          {
            icon: <IoSettingsOutline className="text-lg" />,
            label: "Settings",
            path: "/setting",
          },
        ]
      : []),

    ...(user?.role === "customer" ? [] : []),
    {
      icon: <FiExternalLink className="text-lg" />,
      label: "Log Out",
      path: "/auth/logout",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/50 z-[60]"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`${
          isMobile ? "fixed top-0 left-0 h-full z-[70]" : "h-screen"
        } ${
          isMobile && !isSidebarOpen ? "-translate-x-full" : "translate-x-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <div
          className={`relative h-full transition-all duration-300 ${
            isSidebarOpen
              ? "w-72 p-4 bg-gray-700 text-white"
              : "w-16 px-3 bg-gray-700 py-4"
          }`}
        >
          {/* Mobile Toggle Button */}
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="absolute top-1 -right-10 p-2  text-white rounded-r-lg hover:bg-indigo-800 transition-colors z-[70]"
            >
              {!isSidebarOpen ? <FaBars size={24} /> : <IoMdClose size={24} />}
            </button>
          )}

          <div className="w-full">
            {/* Desktop Toggle Button */}
            <div
              className={`flex  w-full h-12 items-center ${
                !isSidebarOpen ? "justify-center" : "justify-end"
              } transition-all duration-200`}
            >
              {!isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="w- text-white hover:opacity-80 "
                >
                  {isSidebarOpen ? (
                    <FaChevronLeft size={24} />
                  ) : (
                    <FaBars className="text-2xl" />
                  )}
                </button>
              )}
            </div>

            <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={() => isMobile && closeSidebar()}
                    className={({ isActive }) =>
                      `flex items-center space-x-4 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gray-800 text-white"
                          : "text-gray-300 hover:bg-gray-800/50"
                      }`
                    }
                  >
                    <div
                      className={`flex items-center ${
                        isSidebarOpen ? "gap-3 w-full" : "justify-center w-full"
                      }`}
                    >
                      <span>{item.icon}</span>
                      {isSidebarOpen && <div>{item.label}</div>}
                    </div>
                  </NavLink>
                ))}
              </div>

              {/* Profile Section */}
              <Link
                to={"/users/profile"}
                className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-gray-800/50"
              >
                <img
                  className="w-8 h-8 border rounded-full object-cover"
                  src={getProfilePicUrl(user?.profilePicture)}
                  alt={user?.username}
                />
                {/* Always show the name for admin users, even when sidebar is closed */}
                {isSidebarOpen && user?.role === "admin" && (
                  <span>{user?.username}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
