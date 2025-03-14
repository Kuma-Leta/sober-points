import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";
import ImageUploader from "./ImageUploader";
import ToastNotifications, {
  showSuccess,
  showError,
} from "./ToastNotifications";
import VenueInputs from "./VenueInputs"; // Import the new component
import ContactInfo from "./PhoneWebsite";

export default function VenueForm({
  mode = "create",
  venueId,
  onClose,
  onUpdate,
}) {
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
  const [removedImages, setRemovedImages] = useState([]); // Track removed images

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");

  // Debugging: Log mode and venueId changes
  useEffect(() => {
    console.log("Mode changed:", mode);
    console.log("Venue ID:", venueId);
  }, [mode, venueId]);

  // Reset form when switching from "edit" to "create" mode
  useEffect(() => {
    if (mode === "create") {
      console.log("Resetting form for create mode");
      setFormData({
        name: "",
        address: "",
        phone: "",
        latitude: null,
        longitude: null,
        description: "",
        menu: "",
        website: "",
        images: [],
      });
      setRemovedImages([]);
    }
  }, [mode]);

  // Fetch venue data if in edit mode
  useEffect(() => {
    if (mode === "edit" && venueId) {
      console.log("Fetching venue data for edit mode");
      const fetchVenueData = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/venues/${venueId}`);
          const venueData = response.data;
          setFormData({
            name: venueData.name,
            address: venueData.address,
            phone: venueData.phone,
            latitude: venueData.location.coordinates[1],
            longitude: venueData.location.coordinates[0],
            description: venueData.description,
            menu: venueData.menu,
            website: venueData.website || "",
            images: venueData.images || [],
          });
        } catch (error) {
          console.error("Error fetching venue data:", error);
          setError("Failed to fetch venue data. Please try again.");
          showError("Failed to fetch venue data. Please try again.");
        } finally {
          setLoading(false);
        }
      };

      fetchVenueData();
    }
  }, [mode, venueId]);

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

    // Append removed images
    if (removedImages.length > 0) {
      formDataToSend.append("removedImages", JSON.stringify(removedImages));
    }

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

      // Show success toast message
      showSuccess(
        `Venue ${mode === "create" ? "created" : "updated"} successfully!`
      );

      // Wait for 4 seconds before closing the form
      setTimeout(() => {
        handleFormReset();
        setSearchQuery(""); // Reset the search query
        if (typeof onUpdate === "function") {
          onUpdate(); // Trigger update in parent component (if provided)
        }
        if (typeof onClose === "function") {
          onClose(); // Close the modal (if provided)
        }
      }, 4000); // 4000 ms = 4 seconds
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
    setRemovedImages([]); // Reset removedImages
  };

  return (
    <div className="p-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md mt-6">
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
              {/* Render the VenueInputs component */}
              <VenueInputs formData={formData} handleChange={handleChange} />

              <ImageUploader
                formData={formData}
                setFormData={setFormData}
                removedImages={removedImages}
                setRemovedImages={setRemovedImages}
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="w-full pt-12 md:w-1/2">
            <ContactInfo formData={formData} handleChange={handleChange} />
            <p className="text-left dark:bg-darkBg font-medium text-base mb-1 p-1">
              Select Venue Location from Map
            </p>
            <div className="relative h-80 w-full rounded-md border">
              <MapComponent
                setFormData={setFormData}
                initialLatitude={formData.latitude}
                initialLongitude={formData.longitude}
                searchQuery={searchQuery} // Pass searchQuery
                setSearchQuery={setSearchQuery} // Pass setSearchQuery
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white hover:bg-gray-500 transition"
            onClick={onClose} // Use onClose from props
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
