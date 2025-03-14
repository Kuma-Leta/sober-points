import React from "react";

export default function VenueInputs({ formData, handleChange }) {
  return (
    <div className="w-full">
      {/* Left Side Inputs */}
      <div className="w-full">
        {/* Name Input */}
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          onChange={handleChange}
          value={formData.name}
          required
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
        />
        {/* Address Input */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={formData.address}
          required
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg mt-4"
        />
        {/* Description Textarea */}
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg mt-4"
        ></textarea>
        {/* Menu Textarea */}
        <textarea
          name="menu"
          placeholder="Menu Details"
          onChange={handleChange}
          value={formData.menu}
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg mt-4"
        ></textarea>
      </div>
    </div>
  );
}
