import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('user') !== null && localStorage.getItem('token') !== null;

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

export default PublicRoute;