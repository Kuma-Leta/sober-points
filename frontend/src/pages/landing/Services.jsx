import React from "react";
import afBarImage from "../../assets/images/sober3.jfif"; // Import your images
import expertReviewImage from "../../assets/images/sober1.jfif";
import score from "../../assets/images/sober2.jfif";

const Features = () => {
  return (
    <div className="bg-gray-50 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover the Best Alcohol-Free Experiences
        </h1>
        <p className="text-lg text-gray-600">
          Our guide is meticulously curated to showcase exceptional alcohol-free
          offerings. Enjoy expert reviews and user recommendations that elevate
          your experience.
        </p>
      </header>

      <section className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Section 1: Best AF Bars */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src={afBarImage}
              alt="AF Bar"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              The Best Completely AF Bars Around the World
            </h2>
            <p className="text-gray-600 mt-2">
              Trust our Experts to Guide you to the finest bars
            </p>
          </div>

          {/* Section 2: How We Score */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src={score}
              alt="AF Bar"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-2xl font-semibold text-gray-800">
              How We Score
            </h2>
            <p className="text-gray-600 mt-2">
              Explore Personalized Selections That Suit Your Taste
            </p>
          </div>

          {/* Section 3: Expert Reviews */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <img
              src={expertReviewImage}
              alt="Expert Review"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              User Recommendations For Authentic Experiences
            </h2>
            <p className="text-gray-600 mt-2">
              Join a community that shares your passion
            </p>
          </div>

          {/* Section 4: Join Our Community */}
        </div>
      </section>

      <footer className="text-center mt-12">
        <button className="flex flex-start bg-[#1A1A1A] text-white px-8 py-3 rounded-lg text-lg  transition duration-300">
          Explore
        </button>
      </footer>
    </div>
  );
};

export default Features;
