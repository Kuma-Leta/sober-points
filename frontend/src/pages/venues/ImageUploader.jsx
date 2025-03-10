import React, { useRef } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

export default function ImageUploader({ formData, setFormData }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = e.target.files;
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const validFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...validFiles],
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <label className=" dark:bg-darkBg font-medium">Upload Venue Images</label>
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-4 flex flex-wrap items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 min-h-[100px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {formData.images.length > 0 ? (
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
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Drag & Drop images here</p>
        )}
      </div>
      <input
        type="file"
        name="images"
        multiple
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
      />
      <button
        type="button"
        className="flex items-center justify-center bg-gray-400 px-4 py-2 mr-2 rounded text-white hover:bg-gray-500 transition"
        onClick={() => fileInputRef.current.click()}
      >
        <FaUpload className="mr-2" /> Upload Images
      </button>
    </div>
  );
}
