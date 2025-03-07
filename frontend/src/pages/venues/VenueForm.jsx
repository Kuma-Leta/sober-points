import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";

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
    description: "",
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
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setFormData({ ...formData, images: validFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images" && formData.images.length > 0) {
        formData.images.forEach((file) =>
          formDataToSend.append("images", file)
        );
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

  return (
    <div className="p-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2">
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
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            ></textarea>
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
          </form>
        </div>

        {/* Right: Map Section */}
        <div className="w-full md:w-1/2">
          <MapComponent setFormData={setFormData} />
        </div>
      </div>

      {/* Bottom: Action Buttons */}
      <div className="w-full flex justify-end mt-4">
        <button
          type="button"
          className="bg-gray-400 px-4 py-2 mr-2 rounded text-white"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className={`bg-blue-500 px-4 py-2 rounded text-white ${
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
