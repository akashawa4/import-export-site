import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ContactHero from '../components/contact/ContactHero';
import ContactForm from '../components/contact/ContactForm';
import AlternateContacts from '../components/contact/AlternateContacts';

interface ContactPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps = {}) {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation onNavigate={onNavigate} activePage="contact" />
      <ContactHero />
      <ContactForm />
      <AlternateContacts />
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
