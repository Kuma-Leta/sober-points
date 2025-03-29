import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import GoogleSignInButton from "./with social/google";
import { toast, ToastContainer } from "react-toastify"; // Import toast and ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for toast notifications

const Login = () => {
  const { login, error } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const redirectPath = location.state?.from || "/";
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(identifier, password, redirectPath);

    if (success) {
      // Show success toast notification
      toast.success("Login successful! Redirecting...", {
        position: "top-right",
        autoClose: 3000, // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate(redirectPath);
      }, 3000); // Redirect after 3 seconds
    }
  };

  return (
    <div className="flex flex-col dark:text-darkText h-screen justify-center w-screen dark:bg-darkBg items-center">
      {/* Toast Container */}
      <ToastContainer />

      <div className="p-14 w-full md:w-auto md:min-w-[400px] mb-10 border dark:bg-darkCard bg-gray-200">
        <h1 className="mb-4 text-2xl">Login</h1>
        <form className="w-full pb-5" onSubmit={handleLogin}>
          <div className="mb-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border-b-2 border-primary dark:bg-darkBg p-3 focus:outline-none"
            />
          </div>
          <div className="mb-6 items-end flex flex-col">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-primary dark:bg-darkBg p-3 focus:outline-none"
            />
          </div>
          <div className="text-right my-2">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            className="w-full py-3 mb-4 text-lg font-semibold bg-primary text-white hover:bg-opacity-85"
            type="submit"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="m-auto text-center flex text-lg">
            <p>Have account already?</p>{" "}
            <Link className="text-primary" to={"/auth/register"}>
              Register now
            </Link>
          </div>
          <div className="mt-4 mx-auto flex flex-col items-center justify-center w-full">
            <GoogleSignInButton />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
