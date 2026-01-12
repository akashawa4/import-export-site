import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from 'lucide-react';
import WhatsAppIcon from './icons/WhatsAppIcon';

interface FooterProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

export default function Footer({ onNavigate }: FooterProps = {}) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (page: 'home' | 'products' | 'about' | 'contact', e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          <div className="xs:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img src="/companylogo.avif" alt="Amritva Overseas Logo" className="h-14 sm:h-16 w-auto" />
              <h3 className="text-white text-lg sm:text-xl font-bold font-serif">Amritva Overseas</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner for premium towels, organic cow dung products, and eco-friendly exports from India to the world.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={(e) => handleLinkClick('home', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('products', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Products
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('about', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('contact', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={(e) => handleLinkClick('products', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Premium Towels
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('products', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Cow Dung Products
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('products', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Organic Items
                </button>
              </li>
              <li>
                <button
                  onClick={(e) => handleLinkClick('contact', e)}
                  className="hover:text-white transition-colors duration-200 inline-block py-1"
                >
                  Bulk Orders
                </button>
              </li>
            </ul>
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:amritva009@amritvaoverseas.com"
                  className="flex items-start gap-2 hover:text-white transition-colors duration-200"
                >
                  <Mail size={18} className="mt-0.5 flex-shrink-0" />
                  <span className="break-all">amritva009@amritvaoverseas.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919960447001"
                  className="flex items-start gap-2 hover:text-white transition-colors duration-200"
                >
                  <Phone size={18} className="mt-0.5 flex-shrink-0" />
                  <span>+91 9960447001</span>
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Kolhapur, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center sm:text-left">
              &copy; {currentYear} Amritva Overseas. All rights reserved.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/in/amritva-overseas-038bb7379"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-colors duration-200 min-h-0"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/17s5S1W8Br/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors duration-200 min-h-0"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/amritva_7151"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#E1306C] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-colors duration-200 min-h-0"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://wa.me/919960447001"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors duration-200 min-h-0"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
