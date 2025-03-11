import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/api";
import axios from "axios";

// ✅ Fetch all venues
export const fetchVenues = createAsyncThunk(
  "venues/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get("http://localhost:5000/api/venues/");
      console.log(response.data.venues);
      return response.data.venues;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch venues"
      );
    }
  }
);

// ✅ Fetch nearby venues based on user location
export const fetchNearbyVenues = createAsyncThunk(
  "venues/fetchNearby",
  async ({ lat, lng }, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/venues/nearby?lat=${lat}&lng=${lng}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch nearby venues"
      );
    }
  }
);

// ✅ Search venues by query
export const searchVenues = createAsyncThunk(
  "venues/search",
  async (query, thunkAPI) => {
    try {
      const response = await axios.get(
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

// ✅ Define Venue Slice (Reducers & Actions)
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
      .addCase(fetchNearbyVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyVenues = action.payload;
        state.venues = action.payload;
      })
      .addCase(fetchNearbyVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchVenues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchVenues.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
        state.venues = action.payload;
      })
      .addCase(searchVenues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default venueSlice.reducer;
