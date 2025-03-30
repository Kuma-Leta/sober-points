import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/api";
import MapComponent from "./MapComponent";
import ImageUploader from "./ImageUploader";
import ToastNotifications, {
  showSuccess,
  showError,
} from "./ToastNotifications";
import VenueInputs from "./VenueInputs";
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
    website: "",
    alcoholFreeBeersOnTap: [], // New field
    alcoholFreeDrinkBrands: [], // New field
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [removedImages, setRemovedImages] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {}, [mode, venueId]);

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        name: "",
        address: "",
        phone: "",
        latitude: null,
        longitude: null,
        description: "",
        menu: "",
        website: "",
        alcoholFreeBeersOnTap: [],
        alcoholFreeDrinkBrands: [],
        images: [],
      });
      setRemovedImages([]);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "edit" && venueId) {
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
            alcoholFreeBeersOnTap: venueData.alcoholFreeBeersOnTap || [],
            alcoholFreeDrinkBrands: venueData.alcoholFreeDrinkBrands || [],
            images: venueData.images || [],
          });
        } catch (error) {
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

  const handleArrayChange = (fieldName, value) => {
    // Convert comma-separated string to array
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData({ ...formData, [fieldName]: arrayValue });
  };

  const validatePhone = (phone) => {
    const phoneRegex =
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
    return phoneRegex.test(phone);
  };

  const handleCancel = () => {
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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

    if (!validatePhone(formData.phone)) {
      setError("Please provide a valid phone number.");
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("menu", formData.menu);
    formDataToSend.append(
      "alcoholFreeBeersOnTap",
      JSON.stringify(formData.alcoholFreeBeersOnTap)
    );
    formDataToSend.append(
      "alcoholFreeDrinkBrands",
      JSON.stringify(formData.alcoholFreeDrinkBrands)
    );

    if (formData.website.trim() !== "") {
      formDataToSend.append("website", formData.website);
    }

    formDataToSend.append("location[coordinates][0]", formData.longitude);
    formDataToSend.append("location[coordinates][1]", formData.latitude);

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
        response = await axiosInstance.post("/venues/create", formDataToSend, {
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

      setTimeout(() => {
        handleFormReset();
        setSearchQuery("");
        if (typeof onUpdate === "function") {
          onUpdate(response.data.venue);
        }
        if (typeof onClose === "function") {
          onClose();
        }

        if (mode === "create" && userRole !== "admin") {
          navigate(`/venues/my-venue/${response.data.venue._id}`);
        }
      }, 4000);
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
      website: "",
      alcoholFreeBeersOnTap: [],
      alcoholFreeDrinkBrands: [],
      images: [],
    });
    setRemovedImages([]);
  };

  return (
    <div className="p-4 mt-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md">
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
              <VenueInputs formData={formData} handleChange={handleChange} />

              {/* Alcohol-Free Beers on Tap (Left Side) */}
              <div className="form-group">
                <label className="block text-sm font-medium mb-1">
                  Alcohol-Free Beers on Tap (comma separated)
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.alcoholFreeBeersOnTap.join(", ")}
                  onChange={(e) =>
                    handleArrayChange("alcoholFreeBeersOnTap", e.target.value)
                  }
                  placeholder="e.g., Heineken 0.0, Budweiser Zero"
                />
              </div>

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

            {/* Alcohol-Free Drink Brands (Right Side) */}
            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1">
                Alcohol-Free Drink Brands (comma separated)
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={formData.alcoholFreeDrinkBrands.join(", ")}
                onChange={(e) =>
                  handleArrayChange("alcoholFreeDrinkBrands", e.target.value)
                }
                placeholder="e.g., Seedlip, Ritual Zero Proof"
              />
            </div>

            <p className="text-left dark:bg-darkBg font-medium text-base mb-1 p-1">
              Select Venue Location from Map
            </p>
            <div className="relative h-80 w-full rounded-md border">
              <MapComponent
                setFormData={setFormData}
                initialLatitude={formData.latitude}
                initialLongitude={formData.longitude}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            className="bg-gray-400 px-4 py-2 mr-2 rounded text-white hover:bg-gray-500 transition"
            onClick={handleCancel}
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
