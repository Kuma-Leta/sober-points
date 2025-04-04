import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/api";
import { useDispatch } from "react-redux";
import { notification, Spin, Card } from "antd";
import { loginSuccess } from "../redux/actions";
const TOKEN_KEY = "_auth_token";

const EmailVerification = () => {
  const [status, setStatus] = useState("loading");
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("code");
    if (token) {
      axiosInstance
        .get(`/auth/verify-email/${token}`)
        .then((response) => {
          const data = response.data;
          setStatus("success");
          notification.success({
            message: "Verification Successful",
            description: "Your email has been successfully verified! You can now log in.",
          });
          dispatch(loginSuccess(data.token, data.data.user));
          localStorage.setItem(TOKEN_KEY, data.token);

          setTimeout(() => {
            window.location.href = `/my-venue`;
          }, 5000);
        })
        .catch((error) => {
          console.error(error);
          setStatus("error");
          notification.error({
            message: "Verification Failed",
            description: "The token might be invalid or expired.",
          });
        });
    } else {
      setStatus("invalid");
      notification.error({
        message: "Invalid Link",
        description: "Invalid verification link.",
      });
    }
  }, [location.search]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="p-6 max-w-md mx-auto text-center" bordered>
        {status === "loading" && (
          <Spin tip="Verifying your email..." />
        )}
        {status === "success" && (
          <p className="text-green-500">
            Your email has been successfully verified!
          </p>
        )}
        {status === "error" && (
          <p className="text-red-500">
            Verification failed. The token might be invalid or expired.
          </p>
        )}
        {status === "invalid" && (
          <p className="text-red-500">Invalid verification link.</p>
        )}
      </Card>
    </div>
  );
};

export default EmailVerification;
