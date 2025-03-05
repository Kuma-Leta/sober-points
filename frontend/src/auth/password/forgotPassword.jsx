import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axiosInstance from "../../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const {
    forgotPassword,
    loading,
    successMessage,
    resetError: error,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [showResend, setShowResend] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword(email);
  };

  const startCountdown = () => {
    setCountdown(120);
    setCanResend(false);
    setShowResend(true);
    if (!error) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resendEmail = async () => {
    try {
      await axiosInstance.post("/auth/resend-email", {
        email,
        type: "reset-password",
      });
      startCountdown();
    } catch (err) {
      console.error("Error resending email:", err);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      setShowResend(false);
    }
    if (successMessage) {
      toast.success(successMessage);
      startCountdown();
    }
  }, [error, successMessage]);

  return (
    <div className="w-full flex flex-col h-screen justify-center items-center m-auto">
      <ToastContainer />
      <div className="p-14 w-full md:w-auto md:min-w-[400px] mb-10 border dark:border-gray-600 dark:bg-darkCard bg-gray-200">
        <h1 className="mb-4 text-2xl">Forgot Password</h1>
        <form className="w-full pb-5" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 dark:bg-darkBg border-primary p-3 focus:outline-none"
              required
            />
          </div>
          {!showResend && (
            <button
              className="w-full py-3 mb-4 text-lg font-semibold bg-primary text-white hover:bg-opacity-85"
              type="submit"
            >
              {loading ? "sending..." : "Send Reset Link"}
            </button>
          )}
          {successMessage && (
            <div className="w-full flex flex-col items-center">
              <p className="text-green-500 text-center">{successMessage}</p>
              {!error && !loading && showResend && (
                <>
                  <button
                    onClick={resendEmail}
                    disabled={!canResend}
                    className={` px-4 w-max h-max py-2 text-lg font-semibold ${
                      canResend
                        ? "bg-primary"
                        : "bg-gray-400 cursor-not-allowed"
                    } text-white hover:bg-opacity-85`}
                  >
                    {!canResend ? (
                      <p className="text-white">
                        Resend available in {Math.floor(countdown / 60)}:
                        {String(countdown % 60).padStart(2, "0")}
                      </p>
                    ) : (
                      " Resend Email "
                    )}
                  </button>
                </>
              )}
            </div>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="m-auto text-center flex flex-col items-center">
          <Link className="text-primary mb-2" to={"/auth/login"}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
