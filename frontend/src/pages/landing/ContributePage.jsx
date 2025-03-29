import React from "react";
import { Link } from "react-router-dom";

const ContributePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-16 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <h3 className=" flex flex-start font-bold text-gray-900 mb-6">
            Contribute
          </h3>
          <h2 className="text-2xl sm:text-3xl font-semibold text-justify text-gray-800 mb-4">
            Join Us in Mapping Alcohol-Free Locations
          </h2>
        </div>
        <p className=" text-gray-600 max-w-3xl text-justify mx-auto">
          The Sober Map is a community-driven initiative that showcases the best
          alcohol-free offerings around you. By contributing your favorite
          spots, you help others discover places where they can enjoy
          socializing without alcohol. Together, we can create a comprehensive
          guide that celebrates sober living.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Feature 1 */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <img src="/location.png" alt="location" className="w-16 h-16" />
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            How to Add Your Favorite Locations
          </h3>
          <p className="text-gray-600">
            Share your favorite alcohol-free venues with us!
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <img src="/visualize.png" alt="location" className="w-16 h-16" />

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Visualize Your Contributions on the Map
          </h3>
          <p className="text-gray-600">
            See how your input shapes the community.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <img src="/community.png" alt="location" className="w-16 h-16" />

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Engage with Our Growing Community of Contributors
          </h3>
          <p className="text-gray-600">
            Join fellow enthusiasts in promoting sober spaces.
          </p>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          to="/about"
          className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-lg border border-primary hover:bg-primary hover:text-white text-center transition duration-300"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ContributePage;
