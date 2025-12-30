import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface NavigationProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
  activePage?: 'home' | 'products' | 'about' | 'contact' | 'admin';
}

export default function Navigation({ onNavigate, activePage }: NavigationProps = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const ADMIN_EMAIL = 'admin@123.com';
  const isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

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

  // Check for redirect result on mount (when user returns from Google OAuth)
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed in via redirect
          setIsAuthModalOpen(false);
          setIsAuthLoading(false);
          setAuthError(null);
        }
      } catch (error: any) {
        console.error('Redirect sign-in error:', error);
        // Only show error if modal is open
        if (isAuthModalOpen) {
          setAuthError('Failed to sign in with Google. Please try again.');
        }
        setIsAuthLoading(false);
      }
    };
    checkRedirectResult();
  }, []); // Empty dependency array - only run on mount

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Check if sign-in modal should be opened (redirected from enquiry)
  useEffect(() => {
    const shouldOpenSignIn = sessionStorage.getItem('openSignIn') === 'true';
    if (shouldOpenSignIn && !currentUser) {
      sessionStorage.removeItem('openSignIn');
      // Small delay to allow page transition
      setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 300);
    }
  }, [currentUser]);

  // Helper function to detect mobile devices
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
    setAuthError(null);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setIsAuthLoading(false);
    setAuthError(null);
    setEmail('');
    setPassword('');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);

      // Use redirect on mobile devices, popup on desktop
      if (isMobileDevice()) {
        // On mobile, use redirect which works better
        await signInWithRedirect(auth, googleProvider);
        // Note: The modal will close automatically when redirect happens
        // User will be redirected back after authentication
      } else {
        // On desktop, use popup
        await signInWithPopup(auth, googleProvider);
        closeAuthModal();
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);

      // Check if error is due to popup being blocked (fallback to redirect)
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          setAuthError('Failed to sign in with Google. Please try again.');
          setIsAuthLoading(false);
        }
      } else {
        setAuthError(error.message || 'Failed to sign in with Google. Please try again.');
        setIsAuthLoading(false);
      }
    }

    // Only set loading to false if we're not using redirect
    // (redirect will cause page navigation)
    if (!isMobileDevice()) {
      setIsAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsAuthLoading(true);
      await signOut(auth);
    } catch (error) {
      console.error('Sign-out failed:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleEmailAuth = async (mode: 'signin' | 'signup') => {
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    try {
      setAuthError(null);
      setIsAuthLoading(true);
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();
    } catch (error: any) {
      setAuthError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };


  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Products', href: '#products', id: 'products' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white ${isScrolled
          ? 'shadow-lg border-b border-blue-200/40'
          : ''
          }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <button
                onClick={() => onNavigate?.('home')}
                className="flex items-center gap-2 sm:gap-3 text-slate-800 hover:text-blue-800 transition-colors duration-300 group"
              >
                <img src="/favicon.avif" alt="Amritva Overseas Logo" className="h-10 sm:h-12 w-auto rounded-md" />
                <span className="relative text-lg sm:text-2xl font-bold font-serif">
                  <span className="relative z-10">Amritva Overseas</span>
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = activePage === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(link.href, e)}
                    className={`relative font-semibold font-serif text-sm transition-all duration-300 uppercase tracking-wider px-4 py-2 rounded-lg group ${isActive ? 'text-blue-700' : 'text-slate-700 hover:text-blue-800'}`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className={`absolute inset-0 rounded-lg transition-all duration-300 ${isActive ? 'bg-blue-50' : 'opacity-0 group-hover:opacity-100 bg-blue-100/60'}`}></span>
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-blue-700 transition-all duration-300 ${isActive ? 'w-3/4' : 'w-0 group-hover:w-3/4'}`}></span>
                  </a>
                );
              })}
              {isAdmin && (
                <button
                  onClick={() => onNavigate?.('admin')}
                  className={`ml-2 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-slate-100 transition ${activePage === 'admin' ? 'bg-slate-100 text-slate-900 border-slate-400' : 'text-slate-700'}`}
                >
                  Admin Panel
                </button>
              )}
              <button
                onClick={currentUser ? handleSignOut : openAuthModal}
                disabled={isAuthLoading}
                className={`ml-2 inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${currentUser
                  ? 'bg-blue-600/15 text-blue-900 hover:bg-blue-600/25'
                  : 'bg-white/90 text-slate-800 hover:bg-white hover:shadow-lg btn-glow'
                  } ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {currentUser ? `Sign out (${currentUser.displayName?.split(' ')[0] ?? 'User'})` : 'Sign In'}
              </button>
            </div>

            <button
              className="md:hidden p-2.5 rounded-lg transition-all duration-300 text-slate-700 hover:text-blue-800 hover:bg-blue-100/60 z-[110] relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} className="text-slate-800" /> : <Menu size={24} className="text-slate-800" />}
            </button>
          </div>
        </div>

      </nav>
      {isMobileMenuOpen && !isAuthModalOpen && (
        <>
          {/* Backdrop with blur - rendered outside nav */}
          <div
            className="md:hidden fixed left-0 right-0 bottom-0 bg-black/10 backdrop-blur-xl z-[9998] transition-opacity duration-300"
            style={{ top: '64px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Menu - slides in from right */}
          <div
            className="md:hidden fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#F7F9FC]/80 backdrop-blur-3xl z-[9999] border-l-2 border-blue-200/40 shadow-2xl overflow-y-auto animate-slide-in-right"
            style={{ top: '64px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Menu items */}
            <div className="px-6 py-6 pt-4 space-y-4">
              {navLinks.map((link, index) => {
                const isActive = activePage === link.id;
                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href, e);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left font-bold font-serif py-5 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-transparent backdrop-blur-md border-2 shadow-lg active:scale-[0.98] group ${isActive ? 'text-blue-800 border-blue-500/70 bg-blue-50/50' : 'text-slate-900 border-blue-200/50 hover:text-blue-800 hover:border-blue-500/70'}`}
                    style={{
                      animation: `slideInUp 0.3s ease-out ${index * 50}ms both`
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className={`w-1.5 h-1.5 rounded-full bg-blue-500 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
                      {link.label}
                    </span>
                  </button>
                )
              })}
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-bold py-4 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 backdrop-blur-md border-2 border-blue-200 shadow-lg ${activePage === 'admin' ? 'bg-blue-100 text-blue-900 border-blue-400' : 'text-slate-900 bg-blue-50/80 hover:bg-blue-50'}`}
                >
                  Admin Panel
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentUser) {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  } else {
                    // Close menu and open modal immediately
                    setIsMobileMenuOpen(false);
                    // Use requestAnimationFrame to ensure menu closes before modal opens
                    requestAnimationFrame(() => {
                      openAuthModal();
                    });
                  }
                }}
                disabled={isAuthLoading}
                className={`w-full text-left font-bold py-4 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 ${currentUser
                  ? 'text-blue-900 bg-blue-200/40 hover:bg-blue-200/60'
                  : 'text-slate-900 bg-white/80 hover:bg-white btn-glow'
                  } backdrop-blur-md border-2 border-blue-200/40 shadow-lg active:scale-[0.98] ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
              >
                {currentUser ? `Sign out (${currentUser.displayName?.split(' ')[0] ?? 'User'})` : 'Sign In'}
              </button>
            </div>
          </div>
        </>
      )}
      {/* Auth modal */}
      {isAuthModalOpen && !currentUser && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeAuthModal}></div>
          <div className="relative z-[10001] w-full max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900">Continue to Amritva Overseas</h3>
              <button
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition"
                onClick={closeAuthModal}
                aria-label="Close auth modal"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>
            <p className="text-slate-600 text-sm">Sign in or create an account using one of the methods below.</p>

            {authError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            <div className="space-y-5">
              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Email &amp; Password</h4>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEmailAuth('signin')}
                    disabled={isAuthLoading}
                    className={`flex-1 rounded-2xl border border-blue-400 bg-blue-50 py-3 text-sm font-semibold text-blue-900 hover:bg-blue-100 transition btn-glow ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleEmailAuth('signup')}
                    disabled={isAuthLoading}
                    className={`flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 hover:border-blue-400 hover:bg-blue-50 transition ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                  >
                    Create Account
                  </button>
                </div>
              </section>

              <section className="space-y-3">
                <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Google Account</h4>
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isAuthLoading}
                  className={`w-full rounded-2xl border border-blue-400 bg-white/95 py-4 px-4 text-left font-semibold text-slate-900 hover:bg-blue-50 transition flex items-center justify-between ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          fill="#EA4335"
                          d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3.1l3.1 2.4C20.4 17.9 21.2 15.7 21.2 13c0-.7-.1-1.3-.2-1.8H12z"
                        />
                        <path
                          fill="#34A853"
                          d="M6.5 14.3l-.8.6-2.5 2C4.6 19.6 8.1 21.5 12 21.5c2.6 0 4.7-.9 6.3-2.4l-3.1-2.4c-.9.6-2 1-3.2 1-2.5 0-4.6-1.7-5.3-4z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M3.2 7.5C2.4 9 2 10.7 2 12.5s.4 3.5 1.2 4.9l3.3-2.6C6.2 14.1 6 13.3 6 12.5c0-.8.2-1.6.5-2.3L3.2 7.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M12 6.1c1.4 0 2.6.5 3.5 1.4l2.6-2.6C16.7 3.4 14.6 2.5 12 2.5 8.1 2.5 4.6 4.4 3.2 7.5l3.3 2.7C7.4 8.4 9.5 6.1 12 6.1z"
                        />
                      </svg>
                    </span>
                    <span>Continue with Google</span>
                  </span>
                  <span className="text-sm text-blue-700">Preferred</span>
                </button>
              </section>
            </div>
            <div className="text-center text-slate-500 text-sm">
              <p>
                By continuing you agree to our{' '}
                <span className="text-blue-700 font-semibold">Terms &amp; Privacy Policy.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
