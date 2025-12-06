import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AboutHero from '../components/about/AboutHero';
import BrandStory from '../components/about/BrandStory';
import MissionVisionValues from '../components/about/MissionVisionValues';
import ExportCapabilities from '../components/about/ExportCapabilities';
import CompanyTimeline from '../components/about/CompanyTimeline';
import AboutCTA from '../components/about/AboutCTA';

interface AboutPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps = {}) {
  return (
    <div className="min-h-screen bg-white">
      <Navigation onNavigate={onNavigate} />
      <AboutHero />
      <BrandStory />
      <MissionVisionValues />
      <ExportCapabilities />
      <CompanyTimeline />
      <AboutCTA />
      <Footer />
    </div>
  );
}
