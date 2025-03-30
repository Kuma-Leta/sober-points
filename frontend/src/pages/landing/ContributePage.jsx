import React from "react";
import { Link } from "react-router-dom";

const ContributePage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 z-50 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative text-center mb-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-6 text-left">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-wide bg-indigo-100 px-3 py-1 rounded-full">
              Community Contribution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              Help Expand Our <span className="text-primary">Alcohol-Free</span>{" "}
              Map
            </h2>
          </div>

          {/* Right Content (Info Box) */}
          <div className="bg-white shadow-md p-8 rounded-xl border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              The <span className="font-medium text-primary">Sober Map</span> is
              a <strong>community-driven initiative</strong> that showcases the
              best alcohol-free venues worldwide. By contributing your favorite
              spots, you help others discover amazing places to socialize
              without alcohol.
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              Together, we're building a{" "}
              <span className="font-medium">comprehensive guide</span> that
              celebrates and normalizes sober living, one venue at a time.
            </p>
          </div>
        </div>
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
          to="/howToContribute"
          className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-lg border border-primary hover:bg-primary hover:text-white text-center transition duration-300"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
};

export default ContributePage;
