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
      <GoogleOAuthProvider clientId='278012306514-3jd4o7shq0e41s105884eqmrt5821367.apps.googleusercontent.com'>
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>
);
