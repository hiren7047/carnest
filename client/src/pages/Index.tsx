import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyCarnest from "@/components/WhyCarnest";
import FeaturedCars from "@/components/FeaturedCars";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <WhyCarnest />
    <FeaturedCars />
    <HowItWorks />
    <Testimonials />
    <Footer />
  </div>
);

export default Index;
