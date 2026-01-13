import { useState, useEffect } from 'react';
import { Menu, X, Eye, EyeOff } from 'lucide-react';
import {
  signInWithPopup,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

interface NavigationProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin' | 'profile') => void;
  activePage?: 'home' | 'products' | 'about' | 'contact' | 'admin' | 'profile';
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
  const [authInitialized, setAuthInitialized] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
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

  // Save user data to Firestore for admin panel access
  const saveUserToFirestore = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        phoneNumber: user.phoneNumber || null,
        providerId: user.providerData[0]?.providerId || 'email',
        lastLoginAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      }, { merge: true }); // merge: true to not overwrite existing fields
    } catch (error) {
      console.error('Failed to save user to Firestore:', error);
    }
  };

  // Listen to auth state changes - this is the primary way to track if user is signed in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const wasNotSignedIn = !currentUser;
      setCurrentUser(user);
      setAuthInitialized(true);

      // If user just signed in
      if (user && wasNotSignedIn) {
        // Save user data to Firestore
        await saveUserToFirestore(user);

        // Close the modal if it's open
        if (isAuthModalOpen) {
          setIsAuthModalOpen(false);
          setIsAuthLoading(false);
        }

        // Check for pending navigation (user was trying to view products before signing in)
        const pendingNavigation = sessionStorage.getItem('pendingNavigation');
        const pendingCategory = sessionStorage.getItem('pendingCategory');

        if (pendingNavigation === 'products' && pendingCategory) {
          // Clear pending navigation flags
          sessionStorage.removeItem('pendingNavigation');
          sessionStorage.removeItem('pendingCategory');
          sessionStorage.removeItem('openSignIn');

          // Navigate to products with the selected category
          sessionStorage.setItem('navigateToProducts', 'true');
          sessionStorage.setItem('selectedCategory', pendingCategory);

          // Small delay to allow auth state to settle
          setTimeout(() => {
            onNavigate?.('products');
          }, 100);
        }
      }
    });
    return () => unsubscribe();
  }, [isAuthModalOpen, currentUser, onNavigate]);

  // Check if sign-in modal should be opened (redirected from enquiry)
  // Only open if auth is initialized and user is not signed in
  useEffect(() => {
    const checkAndOpenSignIn = () => {
      const shouldOpenSignIn = sessionStorage.getItem('openSignIn') === 'true';
      if (shouldOpenSignIn && authInitialized && !currentUser) {
        sessionStorage.removeItem('openSignIn');
        setIsAuthModalOpen(true);
      } else if (shouldOpenSignIn && currentUser) {
        // User is already signed in, just clear the flag
        sessionStorage.removeItem('openSignIn');
      }
    };

    // Check on mount and auth state changes
    checkAndOpenSignIn();

    // Also listen for storage events (triggered by other components)
    const handleStorageEvent = () => {
      checkAndOpenSignIn();
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [currentUser, authInitialized]);



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
    setAuthMode('signin');
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      setAuthError(null);

      // Use popup for all devices - more reliable than redirect on mobile
      const result = await signInWithPopup(auth, googleProvider);
      closeAuthModal();

      // Check if user has a complete profile
      if (result.user) {
        try {
          const profileRef = doc(db, 'profiles', result.user.uid);
          const profileSnap = await getDoc(profileRef);

          // If no profile or incomplete profile, redirect to profile page
          if (!profileSnap.exists() || !profileSnap.data()?.profileComplete) {
            onNavigate?.('profile');
          }
        } catch (profileError) {
          // If profile check fails, still redirect to profile page for new users
          onNavigate?.('profile');
        }
      }
    } catch (error: any) {
      console.error('Google sign-in failed:', error);

      // Handle specific error cases
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/popup-blocked') {
        setAuthError('Popup was blocked. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User opened another popup, ignore this error
        return;
      } else {
        setAuthError(error.message || 'Failed to sign in with Google. Please try again.');
      }
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
      let result;
      if (mode === 'signin') {
        result = await signInWithEmailAndPassword(auth, email, password);
      } else {
        result = await createUserWithEmailAndPassword(auth, email, password);
      }
      closeAuthModal();

      // Check if user has a complete profile
      if (result.user) {
        try {
          const profileRef = doc(db, 'profiles', result.user.uid);
          const profileSnap = await getDoc(profileRef);

          // If no profile or incomplete profile, redirect to profile page
          if (!profileSnap.exists() || !profileSnap.data()?.profileComplete) {
            onNavigate?.('profile');
          }
        } catch (profileError) {
          // If profile check fails (e.g., new user), redirect to profile page
          onNavigate?.('profile');
        }
      }
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
                <img src="/favicom.avif" alt="Amritva Overseas Logo" className="h-10 sm:h-12 w-auto rounded-md" />
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
              {currentUser ? (
                <button
                  onClick={() => onNavigate?.('profile')}
                  className={`ml-2 inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 bg-blue-600/15 text-blue-900 hover:bg-blue-600/25 ${activePage === 'profile' ? 'ring-2 ring-blue-300' : ''}`}
                >
                  {currentUser.displayName?.split(' ')[0] ?? 'Profile'}
                </button>
              ) : (
                <button
                  onClick={openAuthModal}
                  disabled={isAuthLoading}
                  className={`ml-2 inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-300 bg-white/90 text-slate-800 hover:bg-white hover:shadow-lg btn-glow ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Sign In
                </button>
              )}
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
              {currentUser ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-bold py-4 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 backdrop-blur-md border-2 border-blue-300 shadow-lg bg-blue-50/80 text-blue-900 hover:bg-blue-100 ${activePage === 'profile' ? 'ring-2 ring-blue-400' : ''}`}
                >
                  {currentUser.displayName?.split(' ')[0] ?? 'My Profile'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsMobileMenuOpen(false);
                    requestAnimationFrame(() => {
                      openAuthModal();
                    });
                  }}
                  disabled={isAuthLoading}
                  className={`w-full text-left font-bold py-4 px-5 rounded-xl uppercase tracking-wider transition-all duration-300 text-slate-900 bg-white/80 hover:bg-white btn-glow backdrop-blur-md border-2 border-blue-200/40 shadow-lg active:scale-[0.98] ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  Sign In
                </button>
              )}
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

                {/* Tab selector for Sign In / Create Account */}
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${authMode === 'signin'
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${authMode === 'signup'
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    Create Account
                  </button>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 pr-12 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Single primary action button based on selected mode */}
                <button
                  onClick={() => handleEmailAuth(authMode)}
                  disabled={isAuthLoading}
                  className={`w-full rounded-2xl py-3.5 text-sm font-semibold transition-all duration-200 ${authMode === 'signin'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600'
                    } ${isAuthLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isAuthLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    authMode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </button>

                {/* Helper text based on mode */}
                <p className="text-center text-sm text-slate-500">
                  {authMode === 'signin' ? (
                    <>Don't have an account? <button type="button" onClick={() => setAuthMode('signup')} className="text-blue-600 font-semibold hover:underline">Create one</button></>
                  ) : (
                    <>Already have an account? <button type="button" onClick={() => setAuthMode('signin')} className="text-blue-600 font-semibold hover:underline">Sign in</button></>
                  )}
                </p>
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
