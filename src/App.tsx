import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import CompanyInfo from './components/CompanyInfo';
import FeaturedProducts from './components/FeaturedProducts';
import TrustSection from './components/TrustSection';

import CTABlock from './components/CTABlock';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

// Home page component
function HomePage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={onNavigate} activePage="home" />
      <main id="main-content" role="main">
        <HeroSection onNavigate={onNavigate} />
        {/* Shared background container for CompanyInfo and TrustSection */}
        <div className="relative">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url('/hero/why choose u.avif')`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          >
            <div className="absolute inset-0 bg-slate-900/90"></div>
          </div>
          <div className="relative z-10">
            <CompanyInfo />
            <TrustSection />
          </div>
        </div>
        <FeaturedProducts onNavigate={onNavigate} />

        <CTABlock />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle navigation with smooth transition
  const handleNavigation = (page: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      // Map page names to routes
      const routes: Record<string, string> = {
        home: '/',
        products: '/products',
        about: '/about',
        contact: '/contact',
        admin: '/admin',
        profile: '/profile',
      };

      const route = routes[page] || '/';
      navigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigation} />} />
        <Route path="/products" element={<ProductsPage onNavigate={handleNavigation} />} />
        <Route path="/products/:category" element={<ProductsPage onNavigate={handleNavigation} />} />
        <Route path="/products/:category/:productId" element={<ProductsPage onNavigate={handleNavigation} />} />
        <Route path="/about" element={<AboutPage onNavigate={handleNavigation} />} />
        <Route path="/contact" element={<ContactPage onNavigate={handleNavigation} />} />
        <Route path="/admin" element={<AdminPage onNavigate={handleNavigation} />} />
        <Route path="/profile" element={<ProfilePage onNavigate={handleNavigation} />} />
        {/* Fallback to home for unknown routes */}
        <Route path="*" element={<HomePage onNavigate={handleNavigation} />} />
      </Routes>
    </div>
  );
}

export default App;
