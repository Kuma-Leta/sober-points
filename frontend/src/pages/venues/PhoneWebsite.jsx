import React from "react";

export default function ContactInfo({ formData, handleChange }) {
  return (
    <div className="w-full">
      {/* Phone Input */}
      <input
        type="text"
        name="phone"
        placeholder="Phone Number (e.g., +1234567890)"
        onChange={handleChange}
        value={formData.phone}
        required
        className="w-full px-3 py-2 mb-3 border dark:bg-darkBg rounded-lg"
      />
      {/* Website Input */}
      <input
        type="text"
        name="website"
        placeholder="Website Link (optional)"
        onChange={handleChange}
        value={formData.website}
        className="w-full px-3 py-2 mb-3 border dark:bg-darkBg rounded-lg"
      />
    </div>
  );
}
