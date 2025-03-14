import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/api";

// Fetch all venues
export const fetchVenues = createAsyncThunk(
  "venues/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5000/api/venues/");
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
  async ({ lat, lng }, thunkAPI) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/venues/nearby?lat=${lat}&lng=${lng}`
      );
      return response.data;
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
  async (query , thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        `http://localhost:5000/api/venues/search?query=${query}`
      );
      return response.data.venues;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to search venues"
      );
    }
  }
); 

// Add rating to a venue
export const addVenueRating = createAsyncThunk(
  "venues/addRating",
  async ({ venueId, rating, review }, thunkAPI) => {
    try {
      console.log("Rating:", rating, "Review:", review);
      const response = await axiosInstance.post(
        `http://localhost:5000/api/ratings/addRatings`,
        { rating, review,venueId }
      );
      return response.data; // Should return the updated venue data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add rating"
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
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchNearbyVenues.fulfilled, (state, action) => {
        state.nearbyVenues = action.payload;
        state.venues=action.payload
      })
      .addCase(searchVenues.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.venues = action.payload;
      })
      .addCase(addVenueRating.fulfilled, (state, action) => {
        const updatedVenue = action.payload;
        state.venues = state.venues.map((venue) =>
          venue._id === updatedVenue._id ? updatedVenue : venue
        );
      });
  },
});

export default venueSlice.reducer;
