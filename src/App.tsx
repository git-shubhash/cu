import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Pharma from "./pages/Pharma";
import Lab from "./pages/Lab";
import Radiology from "./pages/Radiology";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/pharma" 
              element={
                <ProtectedRoute requiredDepartment="pharma">
                  <Pharma />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lab" 
              element={
                <ProtectedRoute requiredDepartment="lab">
                  <Lab />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/radiology" 
              element={
                <ProtectedRoute requiredDepartment="radiology">
                  <Radiology />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
