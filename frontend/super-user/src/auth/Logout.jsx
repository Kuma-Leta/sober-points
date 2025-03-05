import React, { useEffect } from "react";
import useAuth from "../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    window.location.href = "/auth/login";
  }, []);
  return <div>logging out...</div>;
}
