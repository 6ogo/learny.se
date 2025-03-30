
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LocalStorageProvider } from "@/context/LocalStorageContext";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

import Home from "./pages/Home";
import StudyPage from "./pages/StudyPage";
import CreateFlashcards from "./pages/CreateFlashcards";
import CategoryPage from "./pages/CategoryPage";
import AchievementsPage from "./pages/AchievementsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocalStorageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/study/:programId" element={<StudyPage />} />
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
    </LocalStorageProvider>
  </QueryClientProvider>
);

export default App;
