import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { BiErrorAlt } from "react-icons/bi";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-darkBg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center">
          <BiErrorAlt className="text-primary dark:text-primaryLight text-9xl mb-8" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 dark:text-darkText mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primaryDark text-white rounded-lg transition-colors duration-200"
        >
          <FaHome className="mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
