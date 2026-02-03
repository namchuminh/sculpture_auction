import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Guard({ roles = [], children }) {
  const { isAuthed, role } = useAuth();

  if (!isAuthed) return <Navigate to="/login" replace />;
  if (roles.length && !roles.includes(role)) return <Navigate to="/" replace />;

  return children;
}
