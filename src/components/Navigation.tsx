import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact') => void;
}

export default function Navigation({ onNavigate }: NavigationProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (href: string, e?: React.MouseEvent) => {
    if (href === '#products' && onNavigate) {
      e?.preventDefault();
      setIsMobileMenuOpen(false);
      onNavigate('products');
    } else if (href === '#about' && onNavigate) {
      e?.preventDefault();
      setIsMobileMenuOpen(false);
      onNavigate('about');
    } else if (href === '#contact' && onNavigate) {
      e?.preventDefault();
      setIsMobileMenuOpen(false);
      onNavigate('contact');
    } else if (href === '#home' && onNavigate) {
      e?.preventDefault();
      setIsMobileMenuOpen(false);
      onNavigate('home');
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F3]/98 backdrop-blur-lg shadow-lg border-b border-amber-200/30'
          : 'bg-[#FAF8F3]/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button
              onClick={() => onNavigate?.('home')}
              className="relative text-2xl font-bold transition-all duration-300 group text-slate-800 hover:text-amber-700"
            >
              <span className="relative z-10">Premium Exports</span>
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-600 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(link.href, e)}
                className="relative font-semibold text-sm transition-all duration-300 uppercase tracking-wider px-4 py-2 rounded-lg group text-slate-700 hover:text-amber-700"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100 bg-amber-100/50 group-hover:bg-amber-100/50"></span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-amber-600 transition-all duration-300 group-hover:w-3/4"></span>
              </a>
            ))}
          </div>

          <button
            className="md:hidden p-2.5 rounded-lg transition-all duration-300 text-slate-600 hover:text-amber-700 hover:bg-amber-100/50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t animate-in slide-in-from-top-2 duration-300 bg-[#FAF8F3]/98 backdrop-blur-lg border-amber-200/30 shadow-lg">
          <div className="px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(link.href, e)}
                className="block font-semibold py-3 px-4 rounded-lg uppercase tracking-wide transition-all duration-300 text-slate-700 hover:text-amber-700 hover:bg-amber-100/50"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
