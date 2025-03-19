import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPlus, FaHeart, FaSearch, FaMapMarkerAlt } from "react-icons/fa";

const BottomNavBar = () => {
  const location = useLocation();

  // Define the navigation items
  const navItems = [
    { icon: <FaPlus size={20} />, path: "/venue/form", label: "Add" },
    { icon: <FaHeart size={20} />, path: "/favorites", label: "Favorites" },
    { icon: <FaSearch size={20} />, path: "#explore", label: "Explore" },
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
      </div>
    </div>
  );
};

export default BottomNavBar;
