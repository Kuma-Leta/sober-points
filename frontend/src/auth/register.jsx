import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import GoogleSignInButton from "./with social/google";

const Register = () => {
  const { register, successMessage, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const location = useLocation();
  const redirectPath =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleRegister = (e) => {
    e.preventDefault();
    register(email, password, name, redirectPath);
  };

  return (
    <>
      <div className="max-w-3xl flex flex-col h-screen dark:text-darkText justify-center dark:bg-darkBg items-center m-auto">
        {successMessage ? (
          <div className="flex flex-col items-center justify-center w-full p-10 bg-white dark:bg-darkCard rounded-lg shadow-lg">
            <h1 className="mb-4 text-3xl font-bold text-green-600">Success!</h1>
            <p className="mb-6 text-lg text-gray-700">{successMessage}</p>
            <Link to="/auth/login" className="text-primary underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="p-14 w-full md:w-auto md:min-w-[400px] mb-10 border dark:bg-darkCard bg-gray-200 rounded-lg shadow-lg">
            <h1 className="mb-4 text-2xl">Sign Up</h1>
            <form className="w-full pb-5" onSubmit={handleRegister}>
              <div className="mb-4 w-full">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b-2 dark:bg-darkBg border-primary p-3 focus:outline-none"
                />
              </div>
              <div className="mb-4 w-full">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b-2 dark:bg-darkBg border-primary p-3 focus:outline-none"
                />
              </div>
              <div className="mb-6 items-end flex flex-col">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b-2 dark:bg-darkBg border-primary p-3 focus:outline-none"
                />
              </div>
              <button
                className="w-full py-3 mb-4 text-lg font-semibold bg-primary text-white hover:bg-opacity-85"
                type="submit"
              >
                Sign Up
              </button>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="m-auto text-center flex text-lg">
                <p>Have an account already?</p>{" "}
                <Link className="text-primary" to={"/auth/login"}>
                  Login
                </Link>
              </div>
            </form>
            <div className="mt-4 mx-auto flex flex-col items-center justify-center w-full">
              <GoogleSignInButton />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
