import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CompanyPortal from "./pages/CompanyPortal";
import DriverPortal from "./pages/DriverPortal";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";
import StationDashboard from "./pages/StationDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/company" element={<CompanyPortal />} />
          <Route path="/driver" element={<DriverPortal />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/station-dashboard" element={<StationDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
