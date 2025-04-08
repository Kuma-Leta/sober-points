import React from "react";

export default function VenueInputs({ formData, handleChange }) {
  return (
    <div className="w-full mt-4 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium flex items-center justify-between mb-1">
          Website <span className="text-gray-500 text-xs">Optional</span>
        </label>
        <input
          type="text"
          name="website"
          placeholder="Enter website URL"
          onChange={handleChange}
          value={formData.website}
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center justify-between">
          Instagram <span className="text-gray-500 text-xs">Optional</span>
        </label>
        <input
          type="text"
          name="instagram"
          placeholder="Enter Instagram handle"
          onChange={handleChange}
          value={formData.instagram}
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium flex items-center justify-between">
          Facebook <span className="text-gray-500 text-xs">Optional</span>
        </label>
        <input
          type="text"
          name="facebook"
          placeholder="Enter Facebook page URL"
          onChange={handleChange}
          value={formData.facebook}
          className="w-full px-3 py-2 border dark:bg-darkBg rounded-lg"
        />
      </div>
    </div>
  );
}
