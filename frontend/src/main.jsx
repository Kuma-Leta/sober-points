import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import store from "./redux/store.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId='950400040435-m6364alic1gl35r7oc17k2992cc4i6hv.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
