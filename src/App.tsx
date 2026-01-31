import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AlumniProvider } from "@/contexts/AlumniContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import ValidasiPage from "./pages/ValidasiPage";
import UserDashboard from "./pages/UserDashboard";
import FormPage from "./pages/FormPage";
import PrestasiPage from "./pages/PrestasiPage";
import CareerHistoryPage from "./pages/CareerHistoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import AIInsightPage from "./pages/AIInsightPage";
import KepuasanPenggunaPage from "./pages/KepuasanPenggunaPage";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AlumniProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/validasi" element={<ValidasiPage />} />
            <Route path="/kepuasan-pengguna" element={<KepuasanPenggunaPage />} />
            
            {/* Student protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/form" element={
              <ProtectedRoute requiredRole="student">
                <FormPage />
              </ProtectedRoute>
            } />
            <Route path="/prestasi" element={
              <ProtectedRoute requiredRole="student">
                <PrestasiPage />
              </ProtectedRoute>
            } />
            <Route path="/riwayat-karir" element={
              <ProtectedRoute requiredRole="student">
                <CareerHistoryPage />
              </ProtectedRoute>
            } />
            
            {/* Admin protected routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/ai-insight" element={
              <ProtectedRoute requiredRole="admin">
                <AIInsightPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AlumniProvider>
  );
}

export default App;
