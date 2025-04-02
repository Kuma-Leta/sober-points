import React from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const ContributePage = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 py-12 z-50 ">
      {/* Hero Section */}
      <div className="relative text-center ">
        <div className="max-w-[1312px] my-8 mx-auto flex md:px-6 flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-[32px] sm:text-[48px] font-bold text-black leading-[120%] tracking-[0%] font-['Helvetica Neue']">
              Join Us in Mapping{" "}
              <span className="sm:whitespace-nowrap">Alcohol-Free </span>Locations
            </h2>
          </div>

          {/* Right Content (Info Box) */}
          <div className="bg-white w-full md:w-1/2 text-left  border-gray-200">
            <p className="text-[18px] text-gray-700 leading-relaxed">
              The Sober Map is a community-driven initiative that showcases the
              best alcohol-free offerings around you. By contributing your
              favorite spots, you help others discover places where they can
              enjoy socializing without alcohol. Together, we can create a
              comprehensive guide that celebrates sober living.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid w-full sm:w-[1312px]  mx-auto md:grid-cols-3 gap-8 mb-12">
        {/* Feature 1 */}
        <div className="bg-white p-8 rounded shadow border border-gray-50">
          <img src="/location.png" alt="location" className="w-16 h-16" />
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            How to Add Your Favorite Locations
          </h3>
          <p className="text-gray-600">
            Share your favorite alcohol-free venues with us!
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white p-8 rounded shadow border border-gray-50">
          <img src="/visualize.png" alt="location" className="w-16 h-16" />

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Visualize Your Contributions on the Map
          </h3>
          <p className="text-gray-600">
            See how your input shapes the community.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white p-8 rounded shadow border border-gray-50">
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
      <div className="flex flex-row items-center justify-center sm:justify-left gap-[24px]">
        <Link
          to="//venue/form"
          className="bg-white  text-gray-800 font-medium px-[24px] py-[12px] rounded border border-primary hover:bg-primary hover:text-white text-center transition duration-300"
        >
          Contribute
        </Link>
        <Link
          to="/howToContribute"
          className="bg-white  flex gap-1 items-center text-gray-800 hover:text-black "
        >
          Learn More <FaAngleRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ContributePage;
