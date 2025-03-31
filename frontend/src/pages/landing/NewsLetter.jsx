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
    <div className=" bg-white text-white px-4 p-8 md:p-16 lg:p-[82px]">
      <div className="flex flex-col flex-start bg-black px-5 xs:px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 lg:py-16 mx-auto  max-w-[1440px] rounded-lg shadow-lg">
        <h2 className="text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4 px-3 xs:px-4 sm:px-5">
          Stay Updated with Our Newsletter
        </h2>
        <p className="mt-3 text-sm xs:text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed mb-6 px-3 xs:px-4 sm:px-5">
          Subscribe for the latest updates and exclusive insights on
          alcohol-free offerings near you.
        </p>

        {/* Subscription Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-md px-3 xs:px-4 sm:px-5"
        >
          <div className="w-full sm:flex-1">
            <input
              type="email"
              placeholder="Your Email Here"
              className="w-full p-3 xs:p-3.5 sm:p-4 rounded-lg border border-gray-500 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm xs:text-sm sm:text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap bg-white text-black font-semibold px-5 xs:px-6 py-2.5 xs:py-3 sm:py-3.5 rounded-lg hover:bg-gray-200 transition duration-300 text-sm xs:text-sm sm:text-base"
            >
              Join Now
            </button>
          </div>
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

        <p className="text-xs xs:text-xs sm:text-sm text-gray-400 mt-4 px-3 xs:px-4 sm:px-5">
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
