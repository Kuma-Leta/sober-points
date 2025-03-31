import React from "react";
import afBarImage from "../../assets/images/sober3.jfif";
import expertReviewImage from "../../assets/images/sober1.jfif";
import score from "../../assets/images/sober2.jfif";

const Features = () => {
  return (
    <div className=" flex flex-col items-start p-8 md:p-16 lg:p-[82px] gap-10 md:gap-16 lg:gap-[40px] w-full mx-auto max-w-[1440px] h-auto bg-white">
      {/* Header - Left-aligned with same padding as content */}
      <header className="text-left px-4 sm:px-6 md:px-[calc((100%-min(1200px,90vw))/2)] mb-10 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
          Discover the Best Alcohol-Free Experiences
        </h1>
        <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
          Our guide is meticulously curated to showcase exceptional alcohol-free
          offerings. Enjoy expert reviews and user recommendations that elevate
          your experience.
        </p>
      </header>

      {/* Main Content - Centered */}
      <section id="aboutUs" className="container mx-auto ">
        <div className="grid grid-cols-1 w-full md:grid-cols-2 lg:grid-cols-3 gap-[48px]">
          {/* Section 1: Best AF Bars */}
          <div className="bg-white rounded shadow transition-shadow">
            <img
              src={afBarImage}
              alt="AF Bar"
              className="w-full h-48 object-cover rounded"
            />
            <div className="p-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                The Best Completely AF Bars Around the World
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Trust our Experts to Guide you to the finest bars
              </p>
            </div>
          </div>

          {/* Section 2: How We Score */}
          <div className="bg-white rounded shadow  transition-shadow">
            <img
              src={score}
              alt="Scoring Method"
              className="w-full h-48 object-cover rounded"
            />
            <div className="p-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                How We Score
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Explore Personalized Selections That Suit Your Taste
              </p>
            </div>
          </div>

          {/* Section 3: Expert Reviews */}
          <div className="bg-white rounded shadow transition-shadow">
            <img
              src={expertReviewImage}
              alt="Expert Review"
              className="w-full h-48 object-cover rounded"
            />
            <div className="p-6 text-center">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                User Recommendations For Authentic Experiences
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                Join a community that shares your passion
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Button */}
      <footer className="text-center mt-8 md:mt-12">
        <a
          className="bg-[#1A1A1A] text-white px-6 py-3 
                     rounded-lg text-base sm:text-lg md:text-xl 
                     hover:bg-black transition duration-300"
          href="/#explore"
        >
          Explore
        </a>
      </footer>
    </div>
  );
};

export default Features;
