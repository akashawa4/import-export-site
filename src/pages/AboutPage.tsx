import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AboutHero from '../components/about/AboutHero';
import BrandStory from '../components/about/BrandStory';
import MissionVisionValues from '../components/about/MissionVisionValues';
import ExportCapabilities from '../components/about/ExportCapabilities';
import CompanyTimeline from '../components/about/CompanyTimeline';
import AboutCTA from '../components/about/AboutCTA';
import AboutProducts from '../components/about/AboutProducts';

interface AboutPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin' | 'profile') => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps = {}) {
  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/hero/About-Us.avif')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80"></div>
      </div>

      <div className="relative z-10">
        <Navigation onNavigate={onNavigate} activePage="about" />
        <AboutHero />
        <BrandStory />
        <MissionVisionValues />
        <ExportCapabilities />
        <AboutProducts />
        <CompanyTimeline />
        <AboutCTA />
        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}
