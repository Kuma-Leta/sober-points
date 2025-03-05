import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";

const ResetPassword = () => {
  const {
    resetPassword,
    loading,
    successMessage,
    resetError: error,
  } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid token! please use the link in your email");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    setPasswordError("");
    resetPassword(token, newPassword);
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (successMessage) {
      toast.success(successMessage);
    }
  }, [error, successMessage]);

  return (
    <div className="w-full flex flex-col h-screen justify-center items-center m-auto">
      <ToastContainer />
      <div className="p-14 w-full md:w-auto md:min-w-[400px] mb-10 border bg-gray-200">
        <h1 className="mb-4 text-2xl">Reset Password</h1>
        <form className="w-full pb-5" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-b-2 border-primary p-3  dark:bg-darkBg focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b-2 border-primary p-3 dark:border-gray-700 dark:bg-darkBg focus:outline-none"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-2">{passwordError}</p>
            )}
          </div>
          <button
            className="w-full py-3 mb-4 text-lg font-semibold bg-primary text-white hover:bg-opacity-85"
            type="submit"
          >
            {loading ? "waiting..." : "Reset Password"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="m-auto text-center flex">
          <Link className="text-primary ml-2" to={"/auth/login"}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
