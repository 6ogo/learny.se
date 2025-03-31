import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LandingPage from './LandingPage';

const Index = () => {
  const { user } = useAuth();
  
  // If user is authenticated, redirect to the home page
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  // Otherwise, show the landing page
  return <LandingPage />;
};

export default Index;
