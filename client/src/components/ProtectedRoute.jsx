import React from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const isAdmin = localStorage.getItem("isAdmin");
  
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
