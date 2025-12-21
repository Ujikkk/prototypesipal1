import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ValidationPage from "./pages/ValidationPage";
import UserDashboard from "./pages/UserDashboard";
import AlumniFormPage from "./pages/AlumniFormPage";
import AdminDashboard from "./pages/AdminDashboard";
import AIInsightsPage from "./pages/AIInsightsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/validasi" element={<ValidationPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/form" element={<AlumniFormPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/ai-insights" element={<AIInsightsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
