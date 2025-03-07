import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";

export default function VenueForm({
  mode = "create",
  venueId,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    menu: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter((file) => {
      return file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024; // 5MB limit
    });
    setFormData({ ...formData, images: validFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        if (formData.images.length > 0) {
          Array.from(formData.images).forEach((file) =>
            formDataToSend.append("images", file)
          );
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (mode === "create") {
        await axiosInstance.post("/venues", formDataToSend);
      } else {
        await axiosInstance.put(`/venues/${venueId}`, formDataToSend);
      }
      onUpdate();
      handleFormReset();
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error saving venue"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFormReset = () => {
    setFormData({
      name: "",
      address: "",
      latitude: null,
      longitude: null,
      menu: "",
      images: [],
    });
    setError(null);
    onClose();
  };

  const handleRegisterLocation = () => {
    navigate("/map", { state: { formData } }); // Navigate to the map page
  };

  return (
    <div className="p-4 w-full max-w-lg bg-white dark:bg-darkCard rounded-md">
      <h2 className="text-xl mb-4">
        {mode === "create" ? "Add New Venue" : "Edit Venue"}
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-lg"
        />
        <textarea
          name="menu"
          placeholder="Menu Details"
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
        ></textarea>
        <input
          type="file"
          name="images"
          multiple
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <button
          type="button"
          onClick={handleRegisterLocation}
          className="w-full bg-green-500 px-4 py-2 rounded text-white"
        >
          Register Location
        </button>
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
            aria-label={mode === "create" ? "Create Venue" : "Update Venue"}
            className={`bg-blue-500 px-4 py-2 rounded text-white ${
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
