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
    <>
    <nav
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
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
            className="md:hidden p-2.5 rounded-lg transition-all duration-300 text-slate-700 hover:text-amber-700 hover:bg-amber-100/50 z-[110] relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} className="text-slate-800" /> : <Menu size={24} className="text-slate-800" />}
          </button>
        </div>
      </div>

    </nav>
    {isMobileMenuOpen && (
      <>
        {/* Backdrop with blur - rendered outside nav */}
        <div 
          className="md:hidden fixed left-0 right-0 bottom-0 bg-black/10 backdrop-blur-xl z-[9998] transition-opacity duration-300"
          style={{ top: '64px' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Menu - slides in from right */}
        <div 
          className="md:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#FAF8F3]/70 backdrop-blur-3xl z-[9999] border-l-2 border-amber-300/30 shadow-2xl overflow-y-auto animate-slide-in-right"
          style={{ top: '64px' }}
        >
          {/* Menu items */}
          <div className="px-6 py-6 pt-8 space-y-4">
            {navLinks.map((link, index) => (
              <button
                key={link.href}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href, e);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left font-bold py-5 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 text-slate-900 hover:text-amber-700 hover:scale-[1.02] hover:shadow-xl bg-transparent backdrop-blur-md border-2 border-amber-200/40 shadow-lg hover:border-amber-400/60 active:scale-[0.98] group"
                style={{
                  animation: `slideInUp 0.3s ease-out ${index * 50}ms both`
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </>
    )}
    </>
  );
}
