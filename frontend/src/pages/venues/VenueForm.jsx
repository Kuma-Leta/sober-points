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
import { FaQuestionCircle } from "react-icons/fa";
import { message } from "antd";

export default function VenueForm({
  mode = "create",
  venueId,
  onClose,
  onUpdate,
}) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    website: "",
    instagram: "",
    facebook: "",
    latitude: null,
    longitude: null,
    images: [],
    additionalInformation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [removedImages, setRemovedImages] = useState([]);
  const userRole = localStorage.getItem("userRole");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        name: "",
        address: "",
        website: "",
        instagram: "",
        facebook: "",
        latitude: null,
        longitude: null,
        images: [],
        additionalInformation: "",
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
            website: venueData.socialMedia?.website || "",
            instagram: venueData.socialMedia?.instagram || "",
            facebook: venueData.socialMedia?.facebook || "",
            latitude: venueData.location.coordinates[1],
            longitude: venueData.location.coordinates[0],
            images: venueData.images || [],
            additionalInformation: venueData.additionalInformation || "",
          });

          // Set checklist values in the form
          if (venueData.checklist && venueData.checklist.length === 6) {
            setTimeout(() => {
              venueData.checklist.forEach((checked, index) => {
                const checkbox = document.querySelector(`#check-${index}`);
                if (checkbox) {
                  checkbox.checked = checked;
                }
              });
            }, 100);
          }
          message.success("Venue data loaded successfully");
        } catch (error) {
          setError("Failed to fetch venue data. Please try again.");
          message.error("Failed to fetch venue data. Please try again.");
          window.scrollTo(0, 0);
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

  const handleCancel = () => {
    message.info("Cancelling form submission");
    if (typeof onClose === "function") {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (
      !formData.name ||
      !formData.address ||
      !formData.latitude ||
      !formData.longitude
    ) {
      setError(
        "Please provide venue name, address, and select a location on the map"
      );
      message.error("Please fill in all required fields");
      window.scrollTo(0, 0);
      return;
    }

    // Validate checklist (require at least 3 checked items)
    const checkboxes = formRef.current.querySelectorAll(
      'input[name="submissionChecklist"]:checked'
    );
    if (checkboxes.length !== 6) {
      setError("Please check all items in the submission checklist");
      message.error("Please check all items in the submission checklist");
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    message.loading("Saving venue data...");

    const formDataToSend = new FormData();

    // Append all fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("website", formData.website || "");
    formDataToSend.append("instagram", formData.instagram || "");
    formDataToSend.append("facebook", formData.facebook || "");
    formDataToSend.append(
      "additionalInformation",
      formData.additionalInformation || ""
    );

    // Convert checklist to array of booleans
    const checklistItems = Array.from(
      formRef.current.querySelectorAll('input[name="submissionChecklist"]')
    ).map((input) => input.checked);
    formDataToSend.append("checklist", JSON.stringify(checklistItems));

    // Location data
    formDataToSend.append(
      "location[coordinates]",
      JSON.stringify([formData.longitude, formData.latitude])
    );

    // Handle images
    if (removedImages.length > 0) {
      formDataToSend.append("removedImages", JSON.stringify(removedImages));
    }

    formData.images.forEach((file) => {
      if (file instanceof File) {
        formDataToSend.append("images", file);
      }
    });

    try {
      const endpoint =
        mode === "create" ? "/venues/create" : `/venues/${venueId}`;

      const method = mode === "create" ? "post" : "put";

      const response = await axiosInstance[method](endpoint, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success(
        `Venue ${mode === "create" ? "created" : "updated"} successfully!`
      );

      if (typeof onUpdate === "function") {
        onUpdate(response.data.venue);
      }
      if (typeof onClose === "function") {
        onClose();
      }

      if (mode === "create" && userRole !== "admin") {
        navigate(`/venues/my-venue/${response.data.venue._id}`);
      }
    } catch (error) {
      console.error(
        "Error saving venue:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message || error.message || "Error saving venue"
      );
      message.error("Failed to save venue. Please try again.");
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-4 w-full max-w-6xl mx-auto bg-white dark:bg-darkCard rounded-md">
      <ToastNotifications />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <h2 className="text-xl mb-4">
              {mode === "create" ? "Add A Venue" : "Edit Venue"}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4 flex flex-col gap-3"
            >
              <div className="relative h-80 w-full rounded-md border">
                <MapComponent
                  setFormData={setFormData}
                  initialLatitude={formData.latitude}
                  initialLongitude={formData.longitude}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Venue Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter venue name"
                    onChange={handleChange}
                    value={formData.name}
                    className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
                    required
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold flex items-center mb-4">
                    Submission checklist{" "}
                    <span className="text-primary flex items-center">
                      *
                      <FaQuestionCircle
                        onMouseEnter={() =>
                          message.info(
                            "Please check each item in the list to confirm your submission meets our criteria"
                          )
                        }
                      />
                    </span>
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "This venue offers at least three alcohol-free drinks beyond basic soft drinks (e.g., alcohol-free beer, wine, cocktails, kombucha).",
                      "The venue offers grown-up alcohol-free options, such as botanical sodas, adaptogenic drinks (like functional mushrooms or calming herbs), shrubs, or premium mixers.",
                      "This venue offers alcohol-free beer on draught",
                      "Alcohol-free options are clearly listed on the menu or drink board",
                      "I have personally visited or have trustworthy knowledge of this venue.",
                      "This venue feels like a welcoming, inclusive space for people choosing not to drink.",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <input
                          type="checkbox"
                          id={`check-${index}`}
                          name="submissionChecklist"
                          value={item}
                          className="mt-1 mr-3 w-5 h-5 text-ternary border-gray-300 rounded focus:ring-ternary"
                          onChange={() =>
                            message.info("Checklist item updated")
                          }
                        />
                        <label
                          htmlFor={`check-${index}`}
                          className="text-gray-700 dark:text-gray-300"
                        >
                          {item}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter venue address"
                    onChange={handleChange}
                    value={formData.address}
                    className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
                    required
                  />
                </div>

                <VenueInputs formData={formData} handleChange={handleChange} />

                <ImageUploader
                  formData={formData}
                  setFormData={setFormData}
                  removedImages={removedImages}
                  setRemovedImages={setRemovedImages}
                />
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">
                    {" "}
                    Additional Information{" "}
                  </label>
                  <textarea
                    name="additionalInformation"
                    placeholder="any additional Information"
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border dark:bg-darkBg min-h-[100px] rounded-lg"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full justify-center mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            className={`bg-primary px-4 py-2 w-full rounded text-white hover:primaryLight transition ${
              loading ? "opacity-50" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : mode === "create" ? "Submit" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
