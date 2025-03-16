import React, { useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

export default function ImageUploader({
  formData,
  setFormData,
  removedImages,
  setRemovedImages,
}) {
  const fileInputRef = useRef(null); // Ref for the file input

  // Base URL for backend images
  const backendBaseUrl = "http://localhost:5000";

  // Handle file upload
  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    // Add new files to the existing images
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  // Handle image removal
  const handleRemoveImage = (index) => {
    const imageToRemove = formData.images[index];

    // If the image is a URL (pre-existing image), add it to the removedImages list
    if (typeof imageToRemove === "string") {
      setRemovedImages((prev) => [...prev, imageToRemove]);
    }

    // Remove the image from the formData
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    // Add new files to the existing images
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="dark:bg-darkBg font-medium">Venue Images</label>
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-wrap items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 min-h-[100px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()} // Make the entire area clickable
      >
        {formData.images.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {formData.images.map((file, index) => (
              <div key={index} className="relative">
                {/* Display image preview */}
                <img
                  src={
                    typeof file === "string"
                      ? `${backendBaseUrl}/${file.replace(/\\/g, "/")}` // Replace backslashes with forward slashes
                      : URL.createObjectURL(file) // Generate preview URL for newly uploaded files
                  }
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                {/* Remove icon */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the file input click
                    handleRemoveImage(index);
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Drag & Drop images here or click to upload</p>
        )}
      </div>
      <div className="flex items-center my-2">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-3 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        name="images"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
      {/* Upload button */}
      <button
        type="button"
        className="flex items-center justify-center bg-gray-400 px-4 py-2 mr-2 rounded text-white hover:bg-gray-500 transition"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent div's click event
          fileInputRef.current.click();
        }}
      >
        <FaUpload className="mr-2" /> Upload Images
      </button>
    </div>
  );
}
