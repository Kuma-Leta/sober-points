import React from "react";
import { motion } from "framer-motion";

// Dummy venue images (replace with actual image paths)
const venueImages = [
  // USA
  {
    id: 1,
    src: "/usa1.jpg",
    country: "USA",
    name: "New York Lounge",
  },
  { id: 2, src: "/usa2.jpg", country: "USA", name: "LA Rooftop Bar" },
  { id: 3, src: "/usa3.jpg", country: "USA", name: "Chicago Jazz Club" },

  // France
  {
    id: 4,
    src: "/france1.jpg",
    country: "France",
    name: "Paris Wine Spot",
  },
  {
    id: 5,
    src: "/france2.jpg",
    country: "France",
    name: "Nice Seaside Café",
  },
  {
    id: 6,
    src: "/france3.jpg",
    country: "France",
    name: "Lyon Gourmet Corner",
  },

  // Germany
  {
    id: 7,
    src: "/germany1.jpg",
    country: "Germany",
    name: "Berlin Bistro",
  },
  {
    id: 8,
    src: "/germany2.jpg",
    country: "Germany",
    name: "Munich Beer Garden",
  },
  {
    id: 9,
    src: "/germany3.jpg",
    country: "Germany",
    name: "Hamburg Lounge",
  },

  // Italy
  {
    id: 10,
    src: "/italy1.jpg",
    country: "Italy",
    name: "Rome Espresso Bar",
  },
  {
    id: 11,
    src: "/italy2.jpg",
    country: "Italy",
    name: "Venice Wine House",
  },
  {
    id: 12,
    src: "/italy3.jpg",
    country: "Italy",
    name: "Florence Fine Dining",
  },

  // Spain
  {
    id: 13,
    src: "/spain1.jpg",
    country: "Spain",
    name: "Madrid Tapas Bar",
  },
  {
    id: 14,
    src: "/spain2.jpg",
    country: "Spain",
    name: "Barcelona Beach Club",
  },
  {
    id: 15,
    src: "/spain3.jpg",
    country: "Spain",
    name: "Seville Garden Café",
  },

  // UK
  {
    id: 16,
    src: "/uk1.jpg",
    country: "UK",
    name: "London Cocktail Lounge",
  },
  { id: 17, src: "/uk2.jpg", country: "UK", name: "Manchester Pub" },
  {
    id: 18,
    src: "/uk3.jpg",
    country: "UK",
    name: "Edinburgh Hidden Gem",
  },

  // Netherlands
  {
    id: 19,
    src: "/netherlands1.jpg",
    country: "Netherlands",
    name: "Amsterdam Canal Bar",
  },
  {
    id: 20,
    src: "/netherlands2.jpg",
    country: "Netherlands",
    name: "Rotterdam Jazz Spot",
  },
  {
    id: 21,
    src: "/netherlands3.jpg",
    country: "Netherlands",
    name: "Rotterdam Jazz Spot",
  },
];

// Group venues by country
const groupedVenues = venueImages.reduce((acc, venue) => {
  acc[venue.country] = [...(acc[venue.country] || []), venue];
  return acc;
}, {});

const VenueList = () => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-darkBg">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Explore Venues by Country
        </h2>

        {Object.keys(groupedVenues).map((country, index) => (
          <div key={index} className="mb-12">
            {/* Country Title */}
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              {country}
            </h3>

            {/* Venue Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {groupedVenues[country].map((venue) => (
                <div
                  key={venue.id}
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: 0.1 * venue.id, duration: 0.5 }}
                  // whileHover={{ scale: 1.05 }}
                  className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                >
                  {/* Venue Image */}
                  <img
                    src={venue.src}
                    alt={venue.name}
                    loading="lazy"
                    className="w-full h-64 object-cover rounded-lg transition-transform duration-100 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      {venue.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VenueList;
