import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Login from "./auth/login";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/common/header";
import Footer from "./components/common/footer";
import Sidebar from "./components/sidebar/index";
import Register from "./auth/register";
import Logout from "./auth/Logout";
import { useSelector } from "react-redux";
import Users from "./pages/users/users";
import ForgotPassword from "./auth/password/forgotPassword";
import ResetPassword from "./auth/password/resetPassword";
import LandingPage from "./pages/landing";
import { API_URL } from "./constants/url";
import Features from "./pages/landing/Services";
import VenueForm from "./pages/venues/VenueForm";
import VenuesPage from "./pages/landing/VenuesPage";
import VenueDetail from "./pages/landing/VenueDetail";
import Venues from "./pages/venues/venues";
import MyVenues from "./pages/venues/myVenues";
import MyVenueDetail from "./pages/venues/myVenueDetail";
import AdminAnalytics from "./pages/venues/AdminAnalytics";
import BottomNavBar from "./pages/venues/BottomNavBar"; // Import the BottomNavBar
import Profile from "./pages/users/profile";
import VenueList from "./pages/landing/VenueList";
import PrivacyPolicy from "./pages/landing/privacyPolicy";
import NotFound from "./pages/404";
import VenueSubmissionPage from "./pages/landing/VenueSubmissionPage";
// import NewsletterManager from "./pages/newsletter/NewsletterManager";
import BlogAdmin from "./pages/blog/admin";
import BlogForm from "./pages/blog/admin/form";
function Pages() {
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const updateFavicon = (url) => {
      const link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = url;
      document.head.appendChild(link);
    };

    if (user?.company?.logo) {
      updateFavicon(`${API_URL}/${user?.company?.logo}`);
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/venue/:id" element={<VenueDetail />} />
      <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
      <Route path="/howToContribute" element={<VenueSubmissionPage />} />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues/nearby"
        element={
          <ProtectedRoute>
            <VenuesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs"
        element={
          <ProtectedRoute>
            <BlogAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs/new"
        element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/blogs/:slug"
        element={
          <ProtectedRoute>
            <BlogForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venues"
        element={
          <ProtectedRoute>
            <Venues />
          </ProtectedRoute>
        }
      />

      {/* <Route
        path="/newsletter"
        element={
          <ProtectedRoute>
            <NewsletterManager />
          </ProtectedRoute>
        }
      /> */}

      <Route
        path="/admin-analytics"
        element={
          <ProtectedRoute>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />
      <Route path="/favorites" element={<VenueList />} />
      <Route path="/ld" element={<LandingPage />} />
      <Route path="/venue/form" element={<VenueForm />} />
      <Route path="/my-venue" element={<MyVenues />} />
      <Route path="/venues/my-venue/:venueId" element={<MyVenueDetail />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/check-in" element={<ProtectedRoute></ProtectedRoute>} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/auth/logout" element={<Logout />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

const Routing = () => {
  const location = useLocation();
  const noSidebarRoutes = [
    "/auth/login",
    "/ld",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  const hideSideBar = !noSidebarRoutes.some((path) =>
    location.pathname.startsWith(path)
  );
  const user = useSelector((state) => state.auth.user);
  const shouldShowSidebar = !noSidebarRoutes.includes(location.pathname);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  if (location.pathname === "privacy policy") {
    return (
      <>
        <Header />
        <PrivacyPolicy />
        <Footer />
      </>
    );
  }

  if (location.pathname === "/auth/login") {
    return (
      <div className="bg-whiteBlue max-w-[120rem] dark:bg-darkBg">
        <Login />
        <Footer />
      </div>
    );
  }

  if (location.pathname === "/auth/register") {
    return (
      <div className="bg-whiteBlue max-w-[120rem] dark:bg-darkBg">
        <Register />
        <Footer />
      </div>
    );
  }
  // if(location.pathname ===)
  return (
    <div className="max-w-[120rem] bg-white dark:text-darkText dark:bg-darkBg mx-auto min-h-screen">
      <ToastContainer />
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          {/* Sidebar */}
          {shouldShowSidebar &&
            user &&
            user.role === "admin" &&
            hideSideBar && (
              <div className="sticky top-0 h-screen">
                <Sidebar />
              </div>
            )}

          {/* Main Content Container */}
          <div className={`flex-1 flex flex-col ${isMobile ? "z-50" : ""}`}>
            {/* Header */}
            <div className=" z-[15] bg-white dark:bg-darkCard w-full">
              <div
              // className={`${
              //   shouldShowSidebar && user && hideSideBar && isMobile
              //     ? "pl-[2.5rem]"
              //     : ""
              // }`}
              >
                <Header />
              </div>
            </div>

            {/* Main Content */}
            <main
              className={`flex-1   dark:bg-darkBg ${
                isMobile ? "relative" : ""
              }`}
            >
              <Pages />
            </main>
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Bottom Navigation Bar for Authenticated Users */}
        {user && isMobile && <BottomNavBar />}
      </div>
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Routing />
  </BrowserRouter>
);

export default App;
