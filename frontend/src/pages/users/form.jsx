import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/api";

export default function UserForm({
  mode = "create",
  userId,
  onClose,
  onUpdate,
}) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (mode === "edit" && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/users/${userId}`);
          setUserData(res.data);
        } catch (error) {
          setError(error.response?.data?.message || "Error fetching user");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [mode, userId]);

  // Handle form field changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle form submission for creating/updating users
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await axiosInstance.post(`/users`, userData);
      } else {
        await axiosInstance.put(`/users/${userId}`, userData);
      }
      onUpdate(); // Trigger parent component to refresh the data
      handleFormReset(); // Reset form and close modal on success
    } catch (error) {
      setError(error.response?.data?.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields and close the modal
  const handleFormReset = () => {
    setUserData({ name: "", email: "", role: "" });
    setError(null);
    onClose();
  };

  // Clear error messages after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="p-4 w-[94vw] sm:w-[60vw] lg:w-[50vw] bg-white dark:bg-darkCard rounded-md">
      <h2 className="text-xl mb-4">
        {mode === "create" ? "Add New User" : "Edit User"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="john doe"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email@domain.com"
            value={userData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-green-100">
            Role
          </label>
          <select
            value={userData.role}
            required
            onChange={handleChange}
            name="role"
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white"
            onClick={handleFormReset} // Close modal and reset form on cancel
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`bg-primary px-4 py-2 rounded text-white ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
