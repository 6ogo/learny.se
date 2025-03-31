
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from '@/context/AuthContext';
import { LocalStorageProvider } from '@/context/LocalStorageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProtectedRoute, PublicRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import Home from '@/pages/Home';
import StudyPage from '@/pages/StudyPage';
import ExamPage from '@/pages/ExamPage';
import CreateFlashcards from '@/pages/CreateFlashcards';
import CategoryPage from '@/pages/CategoryPage';
import AchievementsPage from '@/pages/AchievementsPage';
import AccountPage from '@/pages/AccountPage';
import NotFound from '@/pages/NotFound';
import PricingPage from '@/pages/PricingPage';
import AdminPage from '@/pages/AdminPage';

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/study/:programId",
        element: <StudyPage />,
      },
      {
        path: "/exam/:programId",
        element: <ExamPage />,
      },
      {
        path: "/create",
        element: <CreateFlashcards />,
      },
      {
        path: "/category/:categoryId",
        element: <CategoryPage />,
      },
      {
        path: "/achievements",
        element: <AchievementsPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
      {
        path: "/admin",
        element: <AdminPage />,
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <LocalStorageProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalStorageProvider>
    </AuthProvider>
  );
}

export default App;
