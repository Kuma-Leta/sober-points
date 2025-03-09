import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";
import { FaTimes } from "react-icons/fa";

export default function VenueForm({ mode = "create", venueId, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    description: "",
    menu: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onClose) {
      onClose(); // Close modal if provided
    } else {
      navigate("/"); // Go back to home/landing page
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles], // Append new files to existing ones
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Prepare FormData for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("menu", formData.menu);
    formDataToSend.append("location[coordinates][0]", formData.longitude); // Longitude
    formDataToSend.append("location[coordinates][1]", formData.latitude); // Latitude

    // Append images
    if (formData.images.length > 0) {
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    try {
      if (mode === "create") {
        await axiosInstance.post("/venues", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.put(`/venues/${venueId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      handleCancel();
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error saving venue"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[80px] px-6 sm:px-10 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-darkText dark:text-gray-300">
        {mode === "create" ? "Add New Venue" : "Edit Venue"}
      </h2>

      {error && <div className="text-primary mb-4">{error}</div>}

      {/* Form & Map Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Venue Name"
              onChange={handleChange}
              value={formData.name}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-darkBg dark:text-gray-300"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              onChange={handleChange}
              value={formData.address}
              required
              className="w-full px-4 py-2 border rounded-lg dark:bg-darkBg dark:text-gray-300"
            />
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              value={formData.description}
              className="w-full px-4 py-2 border rounded-lg dark:bg-darkBg dark:text-gray-300"
            ></textarea>
            <textarea
              name="menu"
              placeholder="Menu Details"
              onChange={handleChange}
              value={formData.menu}
              className="w-full px-4 py-2 border rounded-lg dark:bg-darkBg dark:text-gray-300"
            ></textarea>

            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border rounded-lg"
              accept="image/*"
            />
          </form>

          {/* Image Previews */}
          {formData.images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg mb-2 text-darkText dark:text-gray-300">
                Selected Images
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-primary text-white rounded-full p-1 hover:bg-primaryLight transition"
                    >
                      <FaTimes className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Map */}
        <div className="w-full md:w-1/2">
          <MapComponent setFormData={setFormData} />
        </div>
      </div>

      {/* Bottom: Action Buttons */}
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          className="bg-grayColor hover:bg-gray-500 dark:hover:bg-gray-600 text-white px-4 py-2 mr-2 rounded-lg transition"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className={`bg-primary hover:bg-primaryLight dark:hover:bg-primaryDark text-white px-5 py-2 rounded-lg transition ${
            loading ? "opacity-50" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </div>
  );
}
