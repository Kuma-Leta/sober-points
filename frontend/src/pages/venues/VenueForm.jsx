import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";
import ImageUploader from "./ImageUploader";
import ToastNotifications, {
  showSuccess,
  showError,
} from "./ToastNotifications";

export default function VenueForm({ mode = "create", venueId }) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: null,
    longitude: null,
    description: "",
    menu: "",
    website: "", // New website field
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePhone = (phone) => {
    // Basic phone number validation (e.g., +1234567890 or 123-456-7890)
    const phoneRegex =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      isNaN(formData.latitude) ||
      isNaN(formData.longitude) ||
      formData.latitude === null ||
      formData.longitude === null
    ) {
      setError(
        "Please fill out all required fields and select a valid location on the map."
      );
      return;
    }

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setError("Please provide a valid phone number.");
      return;
    }

    setLoading(true);

    // Construct FormData
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("menu", formData.menu);

    // Append website only if it's not empty
    if (formData.website.trim() !== "") {
      formDataToSend.append("website", formData.website);
    }

    formDataToSend.append("location[coordinates][0]", formData.longitude);
    formDataToSend.append("location[coordinates][1]", formData.latitude);

    if (formData.images.length > 0) {
      formData.images.forEach((file) => {
        formDataToSend.append("images", file);
      });
    }

    // Log FormData for debugging
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
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
      // onClose(); // Close the form after successful submission
    } catch (error) {
      console.error(
        "Error saving venue:",
        error.response?.data || error.message
      );
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
      phone: "",
      latitude: null,
      longitude: null,
      description: "",
      menu: "",
      website: "", // Reset website field
      images: [],
    });
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md mt-10">
      <ToastNotifications />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Left Section */}
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

          {/* Right Section */}
          <div className="w-full pt-12 md:w-1/2">
            <input
              type="text"
              name="phone"
              placeholder="Phone Number (e.g., +1234567890)"
              onChange={handleChange}
              value={formData.phone}
              required
              className="w-full px-3 py-2 mb-3 border dark:bg-darkBg rounded-lg"
            />
            <input
              type="text"
              name="website"
              placeholder="Website (optional)"
              onChange={handleChange}
              value={formData.website}
              className="w-full px-3 py-2 mb-3 border dark:bg-darkBg rounded-lg"
            />
            <p className="text-left dark:bg-darkBg font-medium text-base mb-1 p-1">
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
