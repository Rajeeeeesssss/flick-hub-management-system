import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import MovieDetail from "./pages/MovieDetail";
import AdminPage from "./pages/Admin";
import AuthPage from "./pages/Auth";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/AdminLogin";
import PaymentDummy from "./pages/PaymentDummy";
import OtpLogin from "./pages/OtpLogin";
import { useAuth } from "@/hooks/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";

const queryClient = new QueryClient();

const AppLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/payment-dummy" element={<PaymentDummy />} />
            <Route path="/otp-login" element={<OtpLogin />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
