import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 sm:mb-12">
          <div className="xs:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <img src="/favicon.jpg" alt="Amritva Overseas Logo" className="h-10 sm:h-12 w-auto rounded-md" />
              <h3 className="text-white text-lg sm:text-xl font-bold">Amritva Overseas</h3>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner for premium towels, organic cow dung products, and eco-friendly exports from India to the world.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Products
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product Categories</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Premium Towels
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Cow Dung Products
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Organic Items
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200 inline-block py-1">
                  Bulk Orders
                </a>
              </li>
            </ul>
          </div>

          <div className="xs:col-span-2 lg:col-span-1">
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <span className="break-all">amritvaverseas009@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+91 9309578076</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <span>+91 7219075505</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
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
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 min-h-0"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 min-h-0"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 min-h-0"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 min-h-0"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
