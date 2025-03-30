import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api";
import { FaEnvelope, FaUserTag } from "react-icons/fa"; // Icons for email and role

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    profilePicture: "",
    email: "",
    role: "",
  });
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUser(response.data);
        setNewName(response.data.name);

        if (!localStorage.getItem("userId")) {
          localStorage.setItem("userId", response.data._id);
        }
      } catch (error) {
        setError("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle name update
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/users/${user._id}`,
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser({ ...user, name: response.data.name });
      setError("");
      setSuccessMessage("Name updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError("Failed to update name");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture update
  const handleProfilePictureUpdate = async (file) => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setLoading(true);
      const response = await axiosInstance.put(
        `/profile-picture/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser({ ...user, profilePicture: response.data.profilePicture });
      setError("");
      setSuccessMessage("Profile picture updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
    } catch (error) {
      setError("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleProfilePictureUpdate(file);
    }
  };

  return (
    <div className="min-h-screen dark:bg-darkBg mt-4 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 dark:bg-darkCard rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        {/* Display error messages */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Display success messages */}
        {successMessage && (
          <p className="text-green-500 mb-4 text-center">{successMessage}</p>
        )}

        {/* Main Content Grid with Responsive Order */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Right Side: Profile Picture and Name Update (Shown on Top in Mobile View) */}
          <div className="order-1 md:order-2 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            {loading ? (
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-gray-300 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="relative group">
                  <label htmlFor="profilePicture" className="cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-blue-500 transition-all relative">
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : `${import.meta.env.VITE_API_URL}/${user.profilePicture}`
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-sm text-center">
                          Change Profile Picture
                        </span>
                      </div>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>
            )}

            <h2 className="text-xl font-semibold mb-4">Update Name</h2>
            {loading ? (
              <div className="space-y-4">
                <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
                <div className="h-10 bg-gray-300 rounded-md animate-pulse"></div>
              </div>
            ) : (
              <form onSubmit={handleNameUpdate} className="space-y-4">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="border p-2 dark:bg-darkBg rounded-md w-full"
                  placeholder="Enter your name"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-4 py-2 rounded-md justify-center hover:bg-green-600 transition-colors"
                >
                  Update
                </button>
              </form>
            )}
          </div>

          {/* Left Side: Email and Role (Shown Below in Mobile View) */}
          <div className="order-2 md:order-1 space-y-6">
            <h2 className="text-xl font-semibold mb-4">Account Details</h2>
            {loading ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <FaEnvelope className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <FaUserTag className="w-6 h-6 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Role</p>
                    <p className="font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
