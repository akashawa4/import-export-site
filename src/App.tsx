import { useState, useEffect } from 'react';
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

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'products' | 'about' | 'contact' | 'admin'>('home');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigation = (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 200);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

  if (currentPage === 'products') {
    return (
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <ProductsPage onNavigate={handleNavigation} />
      </div>
    );
  }

  if (currentPage === 'about') {
    return (
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <AboutPage onNavigate={handleNavigation} />
      </div>
    );
  }

  if (currentPage === 'contact') {
    return (
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <ContactPage onNavigate={handleNavigation} />
      </div>
    );
  }

  if (currentPage === 'admin') {
    return (
      <div className={`transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <AdminPage onNavigate={handleNavigation} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-200 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Navigation onNavigate={handleNavigation} activePage="home" />
      <HeroSection onNavigate={handleNavigation} />
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
      <FeaturedProducts onNavigate={handleNavigation} />

      <CTABlock />
      <Footer onNavigate={handleNavigation} />
    </div>
  );
}

export default App;
