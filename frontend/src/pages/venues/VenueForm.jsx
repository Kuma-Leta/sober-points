import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";
import ImageUploader from "./ImageUploader";
import ToastNotifications, {
  showSuccess,
  showError,
} from "./ToastNotifications";

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
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      isNaN(formData.latitude) ||
      isNaN(formData.longitude) ||
      formData.latitude === null ||
      formData.longitude === null
    ) {
      setError("Please select a valid location on the map.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("menu", formData.menu);
    formDataToSend.append("location[coordinates][0]", formData.longitude);
    formDataToSend.append("location[coordinates][1]", formData.latitude);

    if (formData.images.length > 0) {
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    try {
      let response;
      if (mode === "create") {
        response = await axiosInstance.post("/venues", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.put(
          `/venues/${venueId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      showSuccess(
        `Venue ${mode === "create" ? "created" : "updated"} successfully!`
      );
      handleFormReset();
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Error saving venue"
      );
      showError("Failed to save venue. Please try again.");
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
      description: "",
      menu: "",
      images: [],
    });
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md mt-20">
      <ToastNotifications />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <h2 className="text-xl mb-4">
              {mode === "create" ? "Add New Venue" : "Edit Venue"}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Venue Name"
                onChange={handleChange}
                value={formData.name}
                required
                className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                onChange={handleChange}
                value={formData.address}
                required
                className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
              />
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
                value={formData.description}
                className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
              ></textarea>
              <textarea
                name="menu"
                placeholder="Menu Details"
                onChange={handleChange}
                value={formData.menu}
                className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
              ></textarea>

              <ImageUploader formData={formData} setFormData={setFormData} />
            </form>
          </div>

          {/* Map Section */}
          <div className="w-full pt-12 md:w-1/2">
            <p className="text-center  dark:bg-darkBg font-medium text-base mb-3 p-2">
              Select Venue Location from Map
            </p>
            <div className="relative h-80 w-full rounded-md border">
              <MapComponent setFormData={setFormData} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white hover:bg-gray-500 transition"
            onClick={() => navigate("/")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700 transition ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "create" ? "Create" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
