import React from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaUserPlus,
  FaMobileAlt,
  FaDirections,
} from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaMapMarkerAlt size={24} />, // Reduced size for small screens
      title: "Interactive Map",
      description:
        "Move around the map and see sober-friendly venues update dynamically.",
    },
    {
      icon: <FaDirections size={24} />,
      title: "Find Venues Near Me",
      description:
        "Use geolocation to find the closest sober-friendly spots in real-time.",
    },
    {
      icon: <FaUserPlus size={24} />,
      title: "User Contributions",
      description:
        "Create an account to add and share new venues with the community.",
    },
    {
      icon: <FaMobileAlt size={24} />,
      title: "Mobile-Friendly Design",
      description:
        "Designed to work seamlessly across all devices, just like Airbnb.",
    },
  ];

  return (
    <section
      id="services"
      className="py-12 bg-gray-50 dark:bg-darkBg dark:text-darkText"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8"
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-white dark:bg-darkCard shadow-md rounded-lg transition-all"
            >
              {/* Icon */}
              <div className="p-3 sm:p-4 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
                {feature.icon}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mt-2">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
