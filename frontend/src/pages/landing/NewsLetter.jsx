import { useState } from "react";
import axiosInstance from "../../api/api";

function NewsLetter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/subscriber", { email });
      setMessage(response.data.message);
      setIsError(false);
      setEmail(""); // Clear input after success
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred.");
      setIsError(true);
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

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
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto px-4 sm:px-6"
        >
          <input
            type="email"
            placeholder="Your Email Here"
            className="w-full p-3 sm:p-4 rounded-lg border border-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto bg-white text-black font-semibold p-3 nowrap rounded-lg hover:bg-gray-200 transition duration-300 text-sm sm:text-base"
          >
            Join Now
          </button>
        </form>

        {/* Message Display */}
        {message && (
          <p
            className={`mt-4 px-4 sm:px-6 text-sm ${
              isError ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-xs sm:text-sm text-gray-400 mt-4 px-4 sm:px-6">
          By clicking Join Now, you agree to our{" "}
          <a
            href="#"
            className="underline hover:text-gray-200 transition duration-300"
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
