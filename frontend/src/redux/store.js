import { configureStore } from "@reduxjs/toolkit";
import venueReducer from "./venue/venueSlice";
import authReducer from "./reducers"; // Keep authentication management separate

const store = configureStore({
  reducer: {
    auth: authReducer,
    venues: venueReducer,
  },
});

export default store;
