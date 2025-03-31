import React from "react";
import { FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import criteria from "../../assets/images/home.png";
import submit from "../../assets/images/masob.png";
import input from "../../assets/images/input.png";

const VenueSubmissionPage = () => {
  return (
    <div className=" flex flex-col items-start p-4 md:p-16 lg:p-[82px] gap-10 md:gap-16 lg:gap-[40px] w-full max-w-[1440px] h-auto bg-white">
      {/* Hero Section */}
      <div className="text-center mb-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
          Submit Your Favorite Alcohol-Free Venue
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          Help us build a comprehensive guide to alcohol-free venues. Your
          suggestions can make a difference in the sober community.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Criteria Section */}
        <div className="bg-white rounded-lg shadow-md p-6 font-black font-normal font-sans flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
          <img
            src={criteria}
            alt="Criteria"
            className="w-16 h-16 object-contain"
          />
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Criteria for Venue Submission
          </h2>
          <p className="text-gray-600 mt-2">
            We look for venues that offer quality alcohol-free options.
          </p>
        </div>

        {/* Submission Guide */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 duration-300">
          <img src={submit} alt="Submit" className="w-16 h-16 object-contain" />
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            How to Submit Your Suggestion
          </h2>
          <p className="text-gray-600 mt-2">
            Fill out our online form with your venue details.
          </p>
        </div>

        {/* Importance of Input */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center text-black font-sans transition-transform transform hover:scale-105 duration-300">
          <img src={input} alt="Input" className="w-16 h-16 object-contain" />
          <h2 className="text-xl font-semibold text-gray-800 mt-4">
            Why Your Input is Valuable
          </h2>
          <p className="text-gray-600 mt-2">
            Your contributions help others discover great options.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex justify-center md:justify-start mt-10">
        <Link
          to="/auth/register"
          className="flex items-center text-lg font-semibold text-white bg-primary px-3 py-3 rounded-lg shadow-md hover:bg-primaryLight transition duration-300"
        >
          Sign In <FaAngleRight />
        </Link>
      </div>
    </div>
  );
};

export default VenueSubmissionPage;
