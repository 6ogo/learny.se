
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalStorageProvider } from "@/context/LocalStorageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

import Home from "./pages/Home";
import StudyPage from "./pages/StudyPage";
import ExamPage from "./pages/ExamPage";
import CreateFlashcards from "./pages/CreateFlashcards";
import CategoryPage from "./pages/CategoryPage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocalStorageProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
              <NavBar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/study/:programId" element={<StudyPage />} />
                  <Route path="/exam/:programId" element={<ExamPage />} />
                  <Route path="/create" element={<CreateFlashcards />} />
                  <Route path="/category/:categoryId" element={<CategoryPage />} />
                  <Route path="/achievements" element={<AchievementsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </LocalStorageProvider>
  </QueryClientProvider>
);

export default App;
