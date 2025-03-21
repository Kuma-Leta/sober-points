import React, { useState } from "react";
import { FaArrowDown, FaArrowUp,FaAngleDown,FaAngleUp } from 'react-icons/fa';
const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is this application about?",
      answer:
        "This application allows users to search and review venues, check ratings, and more.",
    },
    {
      question: "How do I add a review?",
      answer:
        "To add a review, navigate to the venue's page and click the 'Add Review' button.",
    },
    {
      question: "Can I edit or delete my review?",
      answer:
        "Yes, you can edit or delete your review after posting it, provided you're logged in.",
    },
    {
      question: "How do ratings work?",
      answer:
        "Ratings are given on a scale of 1 to 5, with 5 being the best. The average rating is calculated based on all reviews for the venue.",
    },
  ];

  return (
    <div
      id="FAQ"
      className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleAnswer(index)}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {faq.question}
              </h3>
              <span className="text-xl font-bold text-primary">
                {activeIndex === index ? <FaAngleUp/> : <FaAngleDown/>}
              </span>
            </div>
            {activeIndex === index && (
              <div className="pl-6 text-gray-600 text-lg">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
