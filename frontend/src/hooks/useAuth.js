import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginFailure, loginSuccess, logout } from "../redux/actions";
import { useEffect, useState } from "react";
import axiosInstance from "../api/api";
import { toast } from "react-toastify";

const TOKEN_KEY = "_auth_token";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetError1, setError] = useState("");
  const [resetError, setResetError] = useState("");
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    async function fetchUser() {
      try {
        const res = await axiosInstance.get("/me");
        dispatch(loginSuccess(token, res.data));
      } catch (err) {}
    }

    fetchUser();
  }, [dispatch]);

  const login = async (email, password, redirectPath) => {
    setSuccessMessage("");
    setError("");
    try {
      const response = await axiosInstance.post("/login", { email, password });
      setLoading(true);
      const data = response.data;
      if (response.status === 200) {
        dispatch(loginSuccess(data.token, data.data.user));
        setLoading(false);
        window.location.href = redirectPath || "/";
      } else {
        dispatch(loginFailure("an authorized"));
        setError("Unauthorized, meet super admin to access this page");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(
        loginFailure(
          error.response.data.message || "An error occurred during login"
        )
      );
      setError(error.response.data.message || "Invalid credentials");
    }
  };

  const register = async (
    email,
    password,
    name,
    redirectPath,
    additionalData
  ) => {
    setSuccessMessage("");
    setError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/register", {
        email,
        name,
        password,
        ...additionalData, // Spread the additional data for specific user types
      });

      const data = response.data;
      if (response.status === 200) {
        setSuccessMessage(
          "Registration successful! Please check your email to verify your account."
        );
        dispatch(loginSuccess(data.token, data.data.user));
        window.location.href = redirectPath || "/";
      } else {
        dispatch(loginFailure(data.error.message || "Registration failed"));
        setError(data.error.message || "Registration failed");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatch(
        loginFailure(
          error.response.data.message || "An error occurred during registration"
        )
      );
      setError(
        error.response.data.message || "An error occurred during registration"
      );
    }
  };
  const forgotPassword = async (email) => {
    setSuccessMessage("");
    setResetError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/forgot-password", {
        email,
      });

      if (response.status === 201) {
        toast.success("Password reset link sent! Please check your email.");
        setSuccessMessage("Password reset link sent! Please check your email.");
        setResetError("");
      } else {
        setResetError("Failed to send password reset link.");
        setSuccessMessage("");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSuccessMessage("");
      setResetError(
        error.response?.data?.message ||
          "An error occurred during password reset."
      );
    }
  };

  const resetPassword = async (token, newPassword) => {
    setSuccessMessage("");
    setResetError("");
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/auth/reset-password/${token}`,
        {
          password: newPassword,
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Password reset successful! You can now log in.");
        setSuccessMessage("Password reset successful! You can now log in.");
        setResetError("");
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 3000);
      } else {
        setSuccessMessage("");
        toast.error("Failed to reset password.");
        setResetError("Failed to reset password.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSuccessMessage("");
      setResetError(
        error.response?.data?.message ||
          "An error occurred while resetting the password."
      );
    }
  };
  const logoutUser = async () => {
    dispatch(logout());
    dispatch(loginSuccess('', {}));
    await axiosInstance.get("/logout");
  };

  const isLoggedIn = () => {
    setTimeout(() => {}, 500);
    const token = localStorage.getItem(TOKEN_KEY);
    return !!token;
  };

  return {
    isAuthenticated,
    user,
    error,
    login,
    loading,
    register,
    forgotPassword,
    resetPassword,
    logout: logoutUser,
    isLoggedIn,
  };
};

export default useAuth;
