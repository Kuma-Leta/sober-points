import React from "react";

const ContactUs = () => {
  return (
    <section id="contactus" className="py-12 px-4 bg-white dark:bg-darkBg">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-dark dark:text-darkText mb-6">
          Contact Us
        </h2>
        <p className="text-lg text-grayColor dark:text-darkText mb-10">
          We’d love to hear from you. Fill out the form below to get in touch.
        </p>

        <form className="space-y-6">
          {/* Name */}
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-lg font-medium text-dark dark:text-darkText mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your full name"
              className="px-4 py-3 border border-gray-300 rounded-lg dark:bg-darkCard dark:border-darkText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-lg font-medium text-dark dark:text-darkText mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              className="px-4 py-3 border border-gray-300 rounded-lg dark:bg-darkCard dark:border-darkText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="text-lg font-medium text-dark dark:text-darkText mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              placeholder="Write your message here"
              className="px-4 py-3 border border-gray-300 rounded-lg dark:bg-darkCard dark:border-darkText dark:text-darkText focus:outline-none focus:ring-2 focus:ring-primary"
              rows="4"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 mt-4 text-white bg-primary rounded-lg hover:bg-primaryLight focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactUs;
