
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalStorageProvider } from "@/context/LocalStorageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute, PublicRoute } from "@/components/ProtectedRoute";

// Public pages
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Index from "./pages/Index";

// Protected pages
import Home from "./pages/Home";
import StudyPage from "./pages/StudyPage";
import ExamPage from "./pages/ExamPage";
import CreateFlashcards from "./pages/CreateFlashcards";
import CategoryPage from "./pages/CategoryPage";
import AchievementsPage from "./pages/AchievementsPage";
import AccountPage from "./pages/AccountPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocalStorageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="flex flex-col min-h-screen bg-gray-900 transition-colors duration-200">
                  {/* NavBar is now conditionally rendered inside route components instead of here */}
                  <main className="flex-grow">
                    <Routes>
                      {/* Public Routes */}
                      <Route element={<PublicRoute />}>
                        <Route path="/" element={<Index />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/pricing" element={<PricingPage />} />
                      </Route>
                      
                      {/* Protected Routes */}
                      <Route element={<ProtectedRoute />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/study/:programId" element={<StudyPage />} />
                        <Route path="/exam/:programId" element={<ExamPage />} />
                        <Route path="/create" element={<CreateFlashcards />} />
                        <Route path="/category/:categoryId" element={<CategoryPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/account" element={<AccountPage />} />
                      </Route>
                      
                      {/* 404 Route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </BrowserRouter>
            </SubscriptionProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </LocalStorageProvider>
  </QueryClientProvider>
);

export default App;
