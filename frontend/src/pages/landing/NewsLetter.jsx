function NewsLetter() {
  return (
    <div className="bg-white text-white text-center px-4 md:px-6 py-8 sm:py-12 lg:py-16">
      <div className="bg-black py-8 sm:py-12 lg:py-16 mx-auto max-w-4xl rounded-lg shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 px-4 sm:px-6">
          Stay Updated with Our Newsletter
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-xl mx-auto leading-relaxed mb-6 px-4 sm:px-6">
          Subscribe for the latest updates and exclusive insights on
          alcohol-free offerings near you.
        </p>

        {/* Subscription Form */}
        <form
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto px-4 sm:px-6"
          aria-label="Newsletter subscription form"
        >
          <input
            type="email"
            placeholder="Your Email Here"
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            aria-label="Enter your email address"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-white text-black font-semibold p-3 nowrap rounded-lg hover:bg-gray-200 transition duration-300 text-sm sm:text-base"
            aria-label="Subscribe to newsletter"
          >
            Join Now
          </button>
        </form>

        <p className="text-xs sm:text-sm text-gray-400 mt-4 px-4 sm:px-6">
          By clicking Join Now, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-gray-200 transition duration-300"
            aria-label="Terms and Conditions"
          >
            Terms and Conditions
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default NewsLetter;
