import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoutes() {
  const isAuthenticated = localStorage.getItem("user") !== null && localStorage.getItem("token") !== null;
    console.log(isAuthenticated,"auth");
    
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoutes;
