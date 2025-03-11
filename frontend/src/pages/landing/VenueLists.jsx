import React from "react";

const VenueLists = ({ venues }) => {
  if (!Array.isArray(venues)) {
    return <p className="text-grayColor mt-2">No venues found.</p>;
  }

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {venues.length === 0 ? (
        <p className="text-grayColor mt-2">No venues found.</p>
      ) : (
        venues.map((venue) => (
          <div
            key={venue._id}
            className="bg-gray-100 dark:bg-darkCard p-4 rounded-lg shadow"
          >
            <h3 className="text-lg font-semibold">{venue.name}</h3>
            <p className="text-sm text-grayColor">{venue.address}</p>
            {venue.images.length > 0 && (
              <img
                src={venue.images[0]}
                alt={venue.name}
                className="mt-2 rounded-lg w-full h-40 object-cover"
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VenueLists;
