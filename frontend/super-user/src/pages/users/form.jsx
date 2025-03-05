import React, { useState, useEffect } from "react";
import Select from "react-select";
import axiosInstance from "../../api/api";
import { useSelector } from "react-redux";

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
    company: null, // Store only company ID
  });
  const user = useSelector((state) => state.auth.user);
  const [companies, setCompanies] = useState([]); // Store company options
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch companies for the dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axiosInstance.get("/companies/company-names"); // Adjust API route if needed
        const formattedCompanies = res.data.map((company) => ({
          value: company._id,
          label: company.name,
        }));
        setCompanies(formattedCompanies);
      } catch (error) {
        setError("Error fetching companies");
      }
    };
    fetchCompanies();
  }, []);

  // Fetch user data if in edit mode
  useEffect(() => {
    if (mode === "edit" && userId) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const res = await axiosInstance.get(`/users/${userId}`);
          setUserData({
            ...res.data,
            company: res.data.company || null,
          });
        } catch (error) {
          setError("Error fetching user");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [mode, userId]);

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle company selection
  const handleCompanyChange = (selectedOption) => {
    console.log(selectedOption);
    setUserData({
      ...userData,
      company: selectedOption ? selectedOption.value : null,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "create") {
        await axiosInstance.post(`/users`, userData);
      } else {
        await axiosInstance.put(`/users/${userId}`, userData);
      }
      onUpdate(); // Refresh parent component data
      handleFormReset(); // Reset form and close modal
    } catch (error) {
      setError(error.response.data.message || "Error saving user");
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields and close modal
  const handleFormReset = () => {
    setUserData({ name: "", email: "", role: "", company: null });
    setError(null);
    onClose();
  };

  return (
    <div className="p-4 w-[94vw] sm:w-[60vw] lg:w-[50vw] bg-white dark:bg-darkCard rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {mode === "create" ? "Add New User" : "Edit User"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            name="name"
            placeholder="John Doe"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 focus:ring focus:ring-primary"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            name="email"
            placeholder="email@domain.com"
            value={userData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 focus:ring focus:ring-primary"
            required
          />
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Role</label>
          <select
            name="role"
            value={userData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-darkBg dark:border-gray-700 focus:ring focus:ring-primary"
            required
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option disabled value="super-user">
              Super Admin
            </option>
            <option value="customer">Customer</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        {/* Company Select */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Company</label>
          <Select
            options={companies}
            placeholder="Select a company"
            isSearchable
            value={companies.find((c) => c.value === userData.company) || null}
            onChange={handleCompanyChange}
            className="react-select-container dark:bg-darkBg dark:border-gray-700"
            classNamePrefix="react-select"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white"
            onClick={handleFormReset}
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
