import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode as jwt_decode } from "jwt-decode"; // Correct default import

import axiosInstance from "../../api/api";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoogleSignInButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const { credential } = response;
      const decoded = jwt_decode(credential);
      const email = decoded.email;
      const name = decoded.name;
      const profilePicture = decoded.picture;
      const providerId = decoded.sub;

      // Send the extracted information to the backend
      const result = await axiosInstance.post("/auth/google", {
        email,
        name,
        profilePicture,
        providerId,
      });

      const data = result.data;
      if (result.status === 200) {
        dispatch(loginSuccess(data.token, data.data.user));
        localStorage.setItem("_auth_token", data.token);
        window.location.href = "/my-venue";
      } else {
        toast.success("You don't have account with this ID try register");
        dispatch(loginFailure("Google login failed"));
      }
    } catch (error) {
      if (error.status === 400) {
        toast.error(
          error.response.data.message ||
            "You don't have account with this ID try register"
        );
        setTimeout(() => navigate("/auth/register"), 4000);
      }

      dispatch(loginFailure("An error occurred during Google login"));
    }
  };

  const handleError = (error) => {
    dispatch(loginFailure("An error occurred during Google login"));
  };

  return (
    <div className="w-full mb-2">
      <ToastContainer />
      <div className="flex justify-center">
        <GoogleLogin
          width={window.innerWidth <= 640 ? "100%" : 290}
          onSuccess={handleSuccess}
          onFailure={handleError}
        />
      </div>
    </div>
  );
};

export default GoogleSignInButton;
