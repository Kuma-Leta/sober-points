import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/api";

// Fetch all venues
export const fetchVenues = createAsyncThunk(
  "venues/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/venues/");
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch venues"
      );
    }
  }
);

// Fetch nearby venues
export const fetchNearbyVenues = createAsyncThunk(
  "venues/fetchNearby",
  async ({ lat, lng, query = "", page = 1, limit = 15 }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `venues/nearby?lat=${lat}&lng=${lng}&query=${query}&page=${page}&limit=${limit}`
      );
      console.log("response.data.venues: ",response.data.venues)
      return {
        venues: response.data.venues,
        pagination: {
          currentPage: page,
          totalPages: response.data.totalPages,
          totalRecords: response.data.totalRecords
        }
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch nearby venues"
      );
    }
  }
);

// Search venues by query
export const searchVenues = createAsyncThunk(
  "venues/search",
  async (query, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/venues/search?query=${query}`);
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to search venues"
      );
    }
  }
);
export const fetchMostRatedVenues = createAsyncThunk(
  "venues/fetchMostRated",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/venues/most-rated");
      console.log(response);
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch most rated venues"
      );
    }
  }
);

// Fetch newest venues
export const fetchNewestVenues = createAsyncThunk(
  "venues/fetchNewest",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/venues/newest");
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch newest venues"
      );
    }
  }
);

// Fetch nearest venues
export const fetchNearestVenues = createAsyncThunk(
  "venues/fetchNearest",
  async ({ lat, lng }, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `/venues/nearest?lat=${lat}&lng=${lng}`
      );
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch nearest venues"
      );
    }
  }
);
// Update rating for a venue
export const updateVenueRating = createAsyncThunk(
  "venues/updateRating",
  async ({ ratingId, rating, review }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        `/ratings/${ratingId}`,
        { rating, review }
      );
      return response.data; // Should return the updated venue data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update rating"
      );
    }
  }
);

// Add rating to a venue
export const addVenueRating = createAsyncThunk(
  "venues/addRating",
  async ({ venueId, serviceRating, locationRating, review }, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/ratings/addRatings", {
        serviceRating,
        locationRating,
        review,
        venueId,
      });
      return response.data; // Should return the updated venue data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add rating"
      );
    }
  }
);

// Add to favorites
export const addFavorite = createAsyncThunk(
  "venues/addFavorite",
  async (venueId, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/favorites/add", { venueId });
      return { venueId }; // Return the venueId to update the state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add to favorites"
      );
    }
  }
);

// Remove from favorites
export const removeFavorite = createAsyncThunk(
  "venues/removeFavorite",
  async (venueId, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/favorites/remove", {
        venueId,
      });
      return { venueId }; // Return the venueId to update the state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to remove from favorites"
      );
    }
  }
);

// Fetch user favorites
export const fetchFavorites = createAsyncThunk(
  "venues/fetchFavorites",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/favorites");

      return response.data; // Ensure this returns an array of favorites
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch favorites"
      );
    }
  }
);

// Venue Slice
const venueSlice = createSlice({
  name: "venues",
  initialState: {
    venues: [],
    nearbyVenues: [],
    searchResults: [],
    favorites: [], // Initialize favorites as an empty array
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Venues
      .addCase(fetchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Nearby Venues
      .addCase(fetchNearbyVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyVenues.fulfilled, (state, action) => {
        state.nearbyVenues = action.payload;
        state.venues = action.payload;
        state.loading = false;
      })
      .addCase(fetchNearbyVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Search Venues
      .addCase(searchVenues.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.venues = action.payload;
      })

      // Add Rating
      .addCase(addVenueRating.fulfilled, (state, action) => {
        const updatedVenue = action.payload;
        state.venues = state.venues.map((venue) =>
          venue._id === updatedVenue._id ? updatedVenue : venue
        );
      })

      // Update Rating
      .addCase(updateVenueRating.fulfilled, (state, action) => {
        const updatedVenue = action.payload;
        state.venues = state.venues.map((venue) =>
          venue._id === updatedVenue._id ? updatedVenue : venue
        );
      })

      .addCase(addFavorite.fulfilled, (state, action) => {
        const { venueId } = action.payload;
        if (
          !state.favorites.some((favorite) => favorite.venueId._id === venueId)
        ) {
          state.favorites.push({ venueId: { _id: venueId } }); // Add the venueId to favorites
        }
      })

      // Remove Favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        const { venueId } = action.payload;
        state.favorites = state.favorites.filter(
          (favorite) => favorite.venueId._id !== venueId
        ); // Remove the venueId from favorites
      })

      // Fetch Favorites
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload; // Update favorites state
      })
      .addCase(fetchMostRatedVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMostRatedVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchMostRatedVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Newest Venues
      .addCase(fetchNewestVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewestVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchNewestVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Nearest Venues
      .addCase(fetchNearestVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearestVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.venues = action.payload;
      })
      .addCase(fetchNearestVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default venueSlice.reducer;
