import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlumniProvider } from "@/contexts/AlumniContext";
import Index from "./pages/Index";
import ValidasiPage from "./pages/ValidasiPage";
import UserDashboard from "./pages/UserDashboard";
import FormPage from "./pages/FormPage";
import PrestasiPage from "./pages/PrestasiPage";
import AdminDashboard from "./pages/AdminDashboard";
import AIInsightPage from "./pages/AIInsightPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AlumniProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/validasi" element={<ValidasiPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/prestasi" element={<PrestasiPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ai-insight" element={<AIInsightPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AlumniProvider>
  </QueryClientProvider>
);

export default App;
