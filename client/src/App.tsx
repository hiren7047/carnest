import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { FloatingActions } from "@/components/FloatingActions";
import { ProtectedRoute, AdminRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import CarsListing from "./pages/CarsListing.tsx";
import CarDetail from "./pages/CarDetail.tsx";
import SellYourCar from "./pages/SellYourCar.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import AdminCars from "./pages/AdminCars.tsx";
import AdminLayout from "@/components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminSellInquiries from "./pages/admin/AdminSellInquiries.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminHomepage from "./pages/admin/AdminHomepage.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import Contact from "./pages/Contact.tsx";
import Privacy from "./pages/Privacy.tsx";
import Terms from "./pages/Terms.tsx";
import Finance from "./pages/Finance.tsx";
import Insurance from "./pages/Insurance.tsx";
import Gallery from "./pages/Gallery.tsx";
import Reviews from "./pages/Reviews.tsx";
import WhyUs from "./pages/WhyUs.tsx";
import Warranty from "./pages/Warranty.tsx";
import About from "./pages/About.tsx";
import Faqs from "./pages/Faqs.tsx";
import Blogs from "./pages/Blogs.tsx";
import BlogPost from "./pages/BlogPost.tsx";

function PublicChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/admin")) return null;
  return (
    <>
      <MobileBottomNav />
      <FloatingActions />
    </>
  );
}

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="min-h-screen pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cars" element={<CarsListing />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/sell" element={<SellYourCar />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/why-us" element={<WhyUs />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/about" element={<About />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="sell-inquiries" element={<AdminSellInquiries />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <PublicChrome />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
