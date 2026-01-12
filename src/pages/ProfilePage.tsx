import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { User as UserIcon, Phone, Building, MapPin, Save, CheckCircle, LogOut } from 'lucide-react';

// Profile data interface - exported for use in other components
export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    // Additional profile fields
    fullName: string;
    phone: string;
    companyName: string;
    designation: string;
    city: string;
    state: string;
    country: string;
    profileComplete: boolean;
    updatedAt: any;
    createdAt: any;
}

interface ProfilePageProps {
    onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin' | 'profile') => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps = {}) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Profile form state
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        companyName: '',
        designation: '',
        city: '',
        state: '',
        country: 'India',
    });

    // Listen to auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await loadProfile(user.uid, user);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    // Load existing profile from Firestore
    const loadProfile = async (uid: string, user: User) => {
        try {
            setLoading(true);
            setError(null);
            const profileRef = doc(db, 'profiles', uid);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data();
                setProfile({
                    fullName: data.fullName || user?.displayName || '',
                    phone: data.phone || '',
                    companyName: data.companyName || '',
                    designation: data.designation || '',
                    city: data.city || '',
                    state: data.state || '',
                    country: data.country || 'India',
                });
            } else {
                // No profile yet - pre-fill with auth data
                setProfile(prev => ({
                    ...prev,
                    fullName: user?.displayName || '',
                }));
            }
        } catch (err: any) {
            console.error('Failed to load profile:', err);
            // Don't show error for permission errors on new profiles
            if (err.code !== 'permission-denied') {
                // Just pre-fill with auth data instead of showing error
                setProfile(prev => ({
                    ...prev,
                    fullName: user?.displayName || '',
                }));
            }
        } finally {
            setLoading(false);
        }
    };

    // Handle sign out
    const handleSignOut = async () => {
        try {
            setSigningOut(true);
            await signOut(auth);
            sessionStorage.removeItem('userProfile');
            onNavigate?.('home');
        } catch (err: any) {
            console.error('Failed to sign out:', err);
            setError('Failed to sign out. Please try again.');
        } finally {
            setSigningOut(false);
        }
    };

    // Save profile to Firestore
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            setError('You must be signed in to save your profile');
            return;
        }

        // Validate required fields
        if (!profile.fullName.trim()) {
            setError('Please enter your full name');
            return;
        }
        if (!profile.phone.trim()) {
            setError('Please enter your phone number');
            return;
        }

        try {
            setSaving(true);
            setError(null);

            const profileRef = doc(db, 'profiles', currentUser.uid);
            const profileData: Partial<UserProfile> = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                fullName: profile.fullName.trim(),
                phone: profile.phone.trim(),
                companyName: profile.companyName.trim(),
                designation: profile.designation.trim(),
                city: profile.city.trim(),
                state: profile.state.trim(),
                country: profile.country.trim(),
                profileComplete: true,
                updatedAt: serverTimestamp(),
            };

            // Check if document exists
            const existingDoc = await getDoc(profileRef);
            if (!existingDoc.exists()) {
                profileData.createdAt = serverTimestamp();
            }

            await setDoc(profileRef, profileData, { merge: true });

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);

            // Store in session for quick access
            sessionStorage.setItem('userProfile', JSON.stringify({
                fullName: profile.fullName,
                phone: profile.phone,
                email: currentUser.email,
                companyName: profile.companyName,
            }));

        } catch (err: any) {
            console.error('Failed to save profile:', err);
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setError(null);
    };

    // Not signed in
    if (!loading && !currentUser) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navigation onNavigate={onNavigate} activePage="profile" />
                <div className="flex items-center justify-center py-20 px-6">
                    <div className="max-w-md w-full rounded-2xl bg-white shadow-lg p-8 text-center space-y-4">
                        <UserIcon size={48} className="mx-auto text-slate-300" />
                        <h1 className="text-2xl font-bold text-slate-900">Sign In Required</h1>
                        <p className="text-slate-600 text-sm">
                            Please sign in to view and edit your profile.
                        </p>
                        <button
                            onClick={() => {
                                sessionStorage.setItem('openSignIn', 'true');
                                window.dispatchEvent(new Event('storage'));
                            }}
                            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                <Footer onNavigate={onNavigate} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navigation onNavigate={onNavigate} activePage="profile" />

            <main className="max-w-2xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2">Your Profile</h1>
                    <p className="text-slate-600">
                        Complete your profile to auto-fill enquiry forms and get faster responses.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white shadow-md p-12 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-600">Loading your profile...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Profile Picture & Email (Read-only) */}
                        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
                            <div className="flex items-center gap-4 mb-6">
                                {currentUser?.photoURL ? (
                                    <img
                                        src={currentUser.photoURL}
                                        alt={currentUser.displayName || 'Profile'}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <UserIcon size={32} className="text-blue-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-slate-900">{currentUser?.displayName || 'User'}</p>
                                    <p className="text-sm text-slate-500">{currentUser?.email}</p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <UserIcon size={16} />
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your full name"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                        <Phone size={16} />
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+91 9876543210"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Building size={20} />
                                Business Information
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profile.companyName}
                                        onChange={handleChange}
                                        placeholder="Your company name"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={profile.designation}
                                        onChange={handleChange}
                                        placeholder="Your role/designation"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <MapPin size={20} />
                                Location
                            </h2>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={profile.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={profile.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        value={profile.country}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                    >
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {saved && (
                            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                                <CheckCircle size={18} />
                                Profile saved successfully! Your enquiry forms will now be auto-filled.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        Save Profile
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => onNavigate?.('products')}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-6 py-4 text-slate-700 font-semibold hover:bg-slate-50 transition"
                            >
                                Browse Products
                            </button>
                        </div>

                        {/* Sign Out Section */}
                        <div className="pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={signingOut}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-6 py-3 text-red-700 font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {signingOut ? (
                                    <>
                                        <div className="animate-spin w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full"></div>
                                        Signing out...
                                    </>
                                ) : (
                                    <>
                                        <LogOut size={20} />
                                        Sign Out
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            <Footer onNavigate={onNavigate} />
        </div>
    );
}

// Helper function to get user profile (for use in enquiry forms)
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const profileRef = doc(db, 'profiles', uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
            return profileSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Failed to get user profile:', error);
        return null;
    }
};

// Helper to get cached profile from session storage
export const getCachedProfile = (): { fullName: string; phone: string; email: string; companyName: string } | null => {
    const cached = sessionStorage.getItem('userProfile');
    if (cached) {
        try {
            return JSON.parse(cached);
        } catch {
            return null;
        }
    }
    return null;
};
