import React, { useEffect } from "react";
import { useAuth } from "../contexts/fakeAuthContext";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const naviagte = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) naviagte("/");
    },
    [isAuthenticated, naviagte]
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
