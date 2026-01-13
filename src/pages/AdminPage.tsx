import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { Product as CatalogProduct, getImageForType, towelTypesData } from './ProductsPage';
import { Download, Users, Package, RefreshCw, Pencil, Trash2, X, UserPlus } from 'lucide-react';

// Cow Dung product types data
const cowDungTypesData: Record<string, { name: string; subtypes: string[] }> = {
  'Fertilizer Use': {
    name: 'Fertilizer Use',
    subtypes: ['Cake & Powdered Form', 'Compost Booster', 'Organic Pesticide']
  },
  'Spiritual Use': {
    name: 'Spiritual Use',
    subtypes: ['Traditional & Ritual', 'Havan & Pooja', 'Dhoop Sticks']
  }
};

interface AdminPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin' | 'profile') => void;
}

type Product = Omit<CatalogProduct, 'id'> & { id: string };

// User interface for profile data (from profiles collection)
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  fullName: string;
  phone: string;
  companyName: string;
  designation: string;
  city: string;
  state: string;
  country: string;
  providerId?: string;
  profileComplete?: boolean;
  lastLoginAt?: any;
  createdAt?: any;
  updatedAt?: any;
}

// Excel export utility function
const exportToExcel = (users: UserProfile[]) => {
  // Create CSV content with all profile fields
  const headers = ['Full Name', 'Email', 'Phone', 'Company', 'Designation', 'City', 'State', 'Country', 'Provider', 'Profile Complete', 'Last Updated'];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const rows = users.map(user => [
    user.fullName || user.displayName || 'N/A',
    user.email || 'N/A',
    user.phone || 'N/A',
    user.companyName || 'N/A',
    user.designation || 'N/A',
    user.city || 'N/A',
    user.state || 'N/A',
    user.country || 'N/A',
    user.providerId === 'google.com' ? 'Google' : 'Email',
    user.profileComplete ? 'Yes' : 'No',
    formatDate(user.updatedAt || user.createdAt)
  ]);

  // Create CSV string
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `amritva_users_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function AdminPage({ onNavigate }: AdminPageProps = {}) {
  // Tab state
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  // Product states
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [selectedTowelType, setSelectedTowelType] = useState<string>('Bath Towel');
  const [selectedSubtype, setSelectedSubtype] = useState<string>('');
  const towelTypes = Object.keys(towelTypesData);
  const cowDungTypes = Object.keys(cowDungTypesData);

  // Users states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [savingUser, setSavingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    designation: '',
    city: '',
    state: '',
    country: 'India',
    profileComplete: false,
  });

  // Compute available subtypes based on selected towel type
  const availableSubtypes = useMemo(() => {
    if (selectedTowelType && towelTypesData[selectedTowelType]) {
      return towelTypesData[selectedTowelType].subtypes;
    }
    return [];
  }, [selectedTowelType]);

  const [newProduct, setNewProduct] = useState<Omit<CatalogProduct, 'id'>>({
    name: '',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    productSubtype: '',
    description: '',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🧺',
    highlight: '',
    createdAt: Date.now(),
    imageUrl: getImageForType('Bath Towel'),
  });

  const user = auth.currentUser;
  const ADMIN_EMAIL = 'admin@123.com';
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const list: Product[] = snapshot.docs.map((d) => {
          const data = d.data() as CatalogProduct & { id?: number };
          const { id: _ignored, ...rest } = data;

          let priceValue = Number(rest.priceValue);
          if (Number.isNaN(priceValue)) {
            const numericFromString = parseFloat(String(rest.price || '').replace(/[^0-9.]/g, ''));
            priceValue = Number.isNaN(numericFromString) ? 0 : numericFromString;
          }
          const priceString = rest.price
            ? String(rest.price).replace(/^\$/, '₹')
            : `₹${priceValue.toFixed(2)}`;

          return {
            ...rest,
            priceValue,
            price: priceString,
            id: d.id,
            productSubtype: rest.productSubtype ?? '',
          };
        });
        setProducts(list);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAdmin]);

  const handleSave = async (product: Product) => {
    try {
      setSavingId(product.id);
      setError(null);
      const ref = doc(db, 'products', product.id);
      const priceValue = Number(product.priceValue) || 0;
      const priceString = product.price || `₹${priceValue.toFixed(2)}`;

      await updateDoc(ref, {
        name: product.name ?? '',
        category: product.category ?? '',
        categorySlug: product.categorySlug ?? 'towels',
        productType: product.productType ?? '',
        productSubtype: product.productSubtype ?? '',
        description: product.description ?? '',
        price: priceString,
        priceValue,
        imageEmoji: product.imageEmoji ?? (product.categorySlug === 'towels' ? '🧺' : '🌿'),
        highlight: product.highlight ?? '',
        imageUrl: product.imageUrl ?? getImageForType(product.productType ?? ''),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!productId) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this product?');
    if (!confirmDelete) return;

    try {
      setDeletingId(productId);
      setError(null);
      const ref = doc(db, 'products', productId);
      await deleteDoc(ref);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  // Fetch users from Firestore (from profiles collection)
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      // Fetch all user profiles
      const snapshot = await getDocs(collection(db, 'profiles'));
      const userList: UserProfile[] = snapshot.docs.map((d) => ({
        uid: d.id,
        ...d.data(),
      } as UserProfile));

      // Sort by updatedAt in JavaScript (newest first)
      userList.sort((a, b) => {
        const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      setUsers(userList);
      console.log('Fetched user profiles:', userList.length);
    } catch (err: any) {
      console.error('Failed to fetch user profiles:', err);
      setError(err.message || 'Failed to load user profiles');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch users when switching to users tab
  useEffect(() => {
    if (activeTab === 'users' && users.length === 0 && isAdmin) {
      fetchUsers();
    }
  }, [activeTab, isAdmin]);

  // Update user profile
  const handleUpdateUser = async (user: UserProfile) => {
    try {
      setSavingUser(true);
      setError(null);
      const userRef = doc(db, 'profiles', user.uid);
      await updateDoc(userRef, {
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || '',
        designation: user.designation || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        profileComplete: user.profileComplete || false,
        updatedAt: serverTimestamp(),
      });
      // Update local state
      setUsers(prev => prev.map(u => u.uid === user.uid ? { ...user } : u));
      setEditingUser(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSavingUser(false);
    }
  };

  // Delete user profile
  const handleDeleteUser = async (userId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user profile? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      setError(null);
      const userRef = doc(db, 'profiles', userId);
      await deleteDoc(userRef);
      setUsers(prev => prev.filter(u => u.uid !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Add new user profile
  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.email) {
      setError('Name and Email are required');
      return;
    }
    try {
      setSavingUser(true);
      setError(null);
      const userId = `manual_${Date.now()}`;
      const userRef = doc(db, 'profiles', userId);
      await setDoc(userRef, {
        uid: userId,
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Refresh users list
      await fetchUsers();
      setShowAddUserModal(false);
      setNewUser({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        designation: '',
        city: '',
        state: '',
        country: 'India',
        profileComplete: false,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
    } finally {
      setSavingUser(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl bg-white shadow-lg p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Admin Access Only</h1>
          <p className="text-slate-600 text-sm">
            You must be signed in as <span className="font-semibold">admin@123.com</span> to access the admin panel.
          </p>
          <button
            onClick={() => onNavigate?.('home')}
            className="mt-2 inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
            <p className="text-sm text-slate-600">Manage products and users for your store.</p>
          </div>
          <button
            onClick={() => onNavigate?.('products')}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Storefront
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${activeTab === 'products'
                ? 'bg-blue-50 text-blue-700 border-blue-600'
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Package size={18} />
              Products
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-t-xl border-b-2 transition-all ${activeTab === 'users'
                ? 'bg-blue-50 text-blue-700 border-blue-600'
                : 'text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Users size={18} />
              Users
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* Products Tab Content */}
        {activeTab === 'products' && (
          <>
            {loading && <p className="text-slate-600 text-sm">Loading products...</p>}

            {/* Create new product */}
            <section className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Add New Product</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Category</label>
                  <select
                    value={newProduct.categorySlug}
                    onChange={(e) => {
                      const slug = e.target.value as 'towels' | 'cow-dung';
                      if (slug === 'towels') {
                        setSelectedTowelType('Bath Towel');
                        setSelectedSubtype('');
                      } else {
                        setSelectedTowelType('');
                        setSelectedSubtype('');
                      }
                      setNewProduct((p) => ({
                        ...p,
                        categorySlug: slug,
                        category: slug === 'towels' ? 'Towels' : 'Cow Dung Products',
                        imageEmoji: slug === 'towels' ? '🧺' : '🌿',
                        productType: slug === 'towels' ? 'Bath Towel' : '',
                        productSubtype: '',
                      }));
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                  >
                    <option value="towels">Towels</option>
                    <option value="cow-dung">Cow Dung Products</option>
                  </select>
                </div>
                {newProduct.categorySlug === 'towels' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Towel Type</label>
                      <select
                        value={selectedTowelType}
                        onChange={(e) => {
                          const type = e.target.value;
                          setSelectedTowelType(type);
                          setSelectedSubtype('');
                          setNewProduct((p) => ({
                            ...p,
                            productType: type,
                            productSubtype: '',
                            imageUrl: getImageForType(type) || p.imageUrl,
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        {towelTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Towel Subtype</label>
                      <select
                        value={selectedSubtype}
                        onChange={(e) => {
                          const subtype = e.target.value;
                          setSelectedSubtype(subtype);
                          setNewProduct((p) => ({
                            ...p,
                            productSubtype: subtype,
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="">Select Subtype (Optional)</option>
                        {availableSubtypes.map((subtype: string) => (
                          <option key={subtype} value={subtype}>
                            {subtype}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Type</label>
                      <select
                        value={newProduct.productType}
                        onChange={(e) => {
                          const type = e.target.value;
                          setNewProduct((p) => ({
                            ...p,
                            productType: type,
                            productSubtype: '',
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="">Select Type</option>
                        {cowDungTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Subtype</label>
                      <select
                        value={newProduct.productSubtype || ''}
                        onChange={(e) => {
                          setNewProduct((p) => ({
                            ...p,
                            productSubtype: e.target.value,
                          }));
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="">Select Subtype (Optional)</option>
                        {(newProduct.productType && cowDungTypesData[newProduct.productType]
                          ? cowDungTypesData[newProduct.productType].subtypes
                          : []
                        ).map((subtype: string) => (
                          <option key={subtype} value={subtype}>
                            {subtype}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Price (INR)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={newProduct.priceValue}
                    onChange={(e) =>
                      setNewProduct((p) => ({
                        ...p,
                        priceValue: Number(e.target.value),
                        price: `$${Number(e.target.value || 0).toFixed(2)}`,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Highlight Badge (optional)</label>
                  <input
                    type="text"
                    value={newProduct.highlight ?? ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, highlight: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="e.g. Best Seller, New, Limited Stock"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Product Image</label>

                  {/* Image Preview */}
                  {newProduct.imageUrl && (
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 mb-2">Current Image Preview:</p>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={newProduct.imageUrl}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="12">No Image</text></svg>';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <input
                    type="text"
                    value={newProduct.imageUrl ?? ''}
                    onChange={(e) => setNewProduct((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Image URL (optional) - or upload below"
                  />
                  <p className="text-[11px] text-slate-500">
                    Use paths from <code className="font-mono">public/towel/</code> folder, or upload an image below. If
                    left empty, we try to pick an image automatically based on type.
                  </p>
                  <div className="mt-2">
                    <label className="text-[11px] font-semibold text-slate-600 uppercase">Upload Image to Firebase Storage</label>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingNew}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setError(null);
                          setUploadingNew(true);

                          // Create unique filename
                          const timestamp = Date.now();
                          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                          const storageRef = ref(
                            storage,
                            `product-images/new/${timestamp}-${sanitizedName}`
                          );

                          await uploadBytes(storageRef, file);
                          const downloadUrl = await getDownloadURL(storageRef);
                          setNewProduct((p) => ({ ...p, imageUrl: downloadUrl }));
                        } catch (err: any) {
                          console.error('Upload error:', err);
                          setError(err.message || 'Failed to upload image. Please check Firebase Storage rules.');
                        } finally {
                          setUploadingNew(false);
                          e.target.value = '';
                        }
                      }}
                      className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                    />
                    {uploadingNew && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading image...
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Write a clear, attractive description for this product..."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={async () => {
                    try {
                      setCreating(true);
                      setError(null);
                      const createdAt = Date.now();
                      const priceValue = Number(newProduct.priceValue) || 0;
                      const price = newProduct.price || `₹${priceValue.toFixed(2)}`;
                      const imageUrl = newProduct.imageUrl ?? getImageForType(newProduct.productType);

                      await addDoc(collection(db, 'products'), {
                        ...newProduct,
                        createdAt,
                        priceValue,
                        price,
                        imageUrl,
                      });

                      const snapshot = await getDocs(collection(db, 'products'));
                      const list: Product[] = snapshot.docs.map((d) => {
                        const data = d.data() as CatalogProduct & { id?: number };
                        const { id: _ignored, ...rest } = data;
                        return {
                          ...rest,
                          id: d.id,
                        };
                      });
                      setProducts(list);

                      setSelectedTowelType('Bath Towel');
                      setSelectedSubtype('');
                      setNewProduct({
                        name: '',
                        category: 'Towels',
                        categorySlug: 'towels',
                        productType: 'Bath Towel',
                        productSubtype: '',
                        description: '',
                        price: 'Contact for Price',
                        priceValue: 0,
                        imageEmoji: '🧺',
                        highlight: '',
                        createdAt: Date.now(),
                        imageUrl: getImageForType('Bath Towel'),
                      });
                    } catch (err: any) {
                      setError(err.message || 'Failed to create product');
                    } finally {
                      setCreating(false);
                    }
                  }}
                  disabled={creating}
                  className={`rounded-full px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition ${creating ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                >
                  {creating ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </section>

            {!loading && products.length === 0 && (
              <div className="space-y-3">
                <p className="text-slate-600 text-sm">
                  No products found. Use the form above to add your first product.
                </p>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl bg-white shadow-md border border-slate-100 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">
                      {product.name || 'Untitled Product'}
                    </h2>
                    {typeof product.priceValue === 'number' && !Number.isNaN(product.priceValue) && (
                      <span className="text-sm font-semibold text-blue-700">
                        ${product.priceValue.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Name</label>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p) => (p.id === product.id ? { ...p, name: e.target.value } : p))
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Category</label>
                      <select
                        value={product.categorySlug}
                        onChange={(e) => {
                          const slug = e.target.value as 'towels' | 'cow-dung';
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  categorySlug: slug,
                                  category: slug === 'towels' ? 'Towels' : 'Cow Dung Products',
                                  imageEmoji: slug === 'towels' ? '🧺' : '🌿',
                                  productType: slug === 'towels' ? 'Bath Towel' : p.productType,
                                  productSubtype: slug === 'towels' ? '' : p.productSubtype,
                                }
                                : p
                            )
                          );
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                      >
                        <option value="towels">Towels</option>
                        <option value="cow-dung">Cow Dung Products</option>
                      </select>
                    </div>
                    {product.categorySlug === 'towels' ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-600 uppercase">Towel Type</label>
                          <select
                            value={product.productType}
                            onChange={(e) => {
                              const type = e.target.value;
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? {
                                      ...p,
                                      productType: type,
                                      productSubtype: '', // Reset subtype when type changes
                                      imageUrl: getImageForType(type) || p.imageUrl,
                                    }
                                    : p
                                )
                              );
                            }}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                          >
                            {towelTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-600 uppercase">Towel Subtype</label>
                          <select
                            value={product.productSubtype || ''}
                            onChange={(e) => {
                              const subtype = e.target.value;
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? {
                                      ...p,
                                      productSubtype: subtype,
                                    }
                                    : p
                                )
                              );
                            }}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                          >
                            <option value="">Select Subtype (Optional)</option>
                            {(product.productType && towelTypesData[product.productType]
                              ? towelTypesData[product.productType].subtypes
                              : []
                            ).map((subtype: string) => (
                              <option key={subtype} value={subtype}>
                                {subtype}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-600 uppercase">Type</label>
                          <select
                            value={product.productType}
                            onChange={(e) => {
                              const type = e.target.value;
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? {
                                      ...p,
                                      productType: type,
                                      productSubtype: '',
                                    }
                                    : p
                                )
                              );
                            }}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                          >
                            <option value="">Select Type</option>
                            {cowDungTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-600 uppercase">Subtype</label>
                          <select
                            value={product.productSubtype || ''}
                            onChange={(e) => {
                              const subtype = e.target.value;
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id
                                    ? {
                                      ...p,
                                      productSubtype: subtype,
                                    }
                                    : p
                                )
                              );
                            }}
                            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                          >
                            <option value="">Select Subtype (Optional)</option>
                            {(product.productType && cowDungTypesData[product.productType]
                              ? cowDungTypesData[product.productType].subtypes
                              : []
                            ).map((subtype: string) => (
                              <option key={subtype} value={subtype}>
                                {subtype}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Price (INR)</label>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={product.priceValue}
                        onChange={(e) => {
                          const value = Number(e.target.value) || 0;
                          setProducts((prev) =>
                            prev.map((p) =>
                              p.id === product.id
                                ? {
                                  ...p,
                                  priceValue: value,
                                  price: `$${value.toFixed(2)}`,
                                }
                                : p
                            )
                          );
                        }}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Highlight (optional)</label>
                      <input
                        type="text"
                        value={product.highlight ?? ''}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p) => (p.id === product.id ? { ...p, highlight: e.target.value } : p))
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="e.g. Best Seller, New, Limited Stock"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Product Image</label>

                      {/* Image Preview */}
                      {product.imageUrl && (
                        <div className="mb-3">
                          <p className="text-xs text-slate-500 mb-2">Current Image:</p>
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-200">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2394a3b8" font-size="12">No Image</text></svg>';
                              }}
                            />
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        value={product.imageUrl ?? ''}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p) => (p.id === product.id ? { ...p, imageUrl: e.target.value } : p))
                          )
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Image URL - or upload below"
                      />
                      <p className="text-[11px] text-slate-500">
                        Use images from <code className="font-mono">public/towel/</code>, or upload an image below. If left
                        empty, the card may fall back to the emoji.
                      </p>
                      <div className="mt-2">
                        <label className="text-[11px] font-semibold text-slate-600 uppercase">Upload Image to Firebase Storage</label>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingProductId === product.id}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setError(null);
                              setUploadingProductId(product.id);

                              // Create unique filename
                              const timestamp = Date.now();
                              const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                              const storageRef = ref(
                                storage,
                                `product-images/${product.id}/${timestamp}-${sanitizedName}`
                              );

                              await uploadBytes(storageRef, file);
                              const downloadUrl = await getDownloadURL(storageRef);
                              setProducts((prev) =>
                                prev.map((p) =>
                                  p.id === product.id ? { ...p, imageUrl: downloadUrl } : p
                                )
                              );
                            } catch (err: any) {
                              console.error('Upload error:', err);
                              setError(err.message || 'Failed to upload image. Check Firebase Storage rules.');
                            } finally {
                              setUploadingProductId(null);
                              e.target.value = '';
                            }
                          }}
                          className="mt-1 block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                        />
                        {uploadingProductId === product.id && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading image...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600 uppercase">Description</label>
                      <textarea
                        value={product.description ?? ''}
                        onChange={(e) =>
                          setProducts((prev) =>
                            prev.map((p) => (p.id === product.id ? { ...p, description: e.target.value } : p))
                          )
                        }
                        rows={3}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Write a clear, attractive description for this product..."
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className={`rounded-full px-4 py-2 text-sm font-semibold border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition ${deletingId === product.id ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                    >
                      {deletingId === product.id ? 'Deleting...' : 'Delete'}
                    </button>
                    <button
                      onClick={() => handleSave(product)}
                      disabled={savingId === product.id}
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition ${savingId === product.id ? 'cursor-not-allowed opacity-60' : ''
                        }`}
                    >
                      {savingId === product.id ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


        {activeTab === 'users' && (
          <section className="space-y-6">
            {/* Users Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registered Users</h2>
                <p className="text-sm text-slate-600">
                  {users.length} user{users.length !== 1 ? 's' : ''} tracked • Users appear here after signing in
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
                >
                  <UserPlus size={16} />
                  Add User
                </button>
                <button
                  onClick={fetchUsers}
                  disabled={loadingUsers}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loadingUsers ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => exportToExcel(users)}
                  disabled={users.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download size={16} />
                  Download Excel
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loadingUsers && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-slate-600">
                  <RefreshCw size={20} className="animate-spin" />
                  <span>Loading users...</span>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loadingUsers && users.length === 0 && (
              <div className="rounded-2xl bg-white shadow-md border border-slate-100 p-12 text-center">
                <Users size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No users yet</h3>
                <p className="text-sm text-slate-600">
                  When users sign in to your site, they will appear here.
                </p>
              </div>
            )}

            {/* Users Table */}
            {!loadingUsers && users.length > 0 && (
              <div className="rounded-2xl bg-white shadow-md border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.map((user) => (
                        <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.fullName || user.displayName || 'User'}
                                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-blue-600 font-semibold text-sm">
                                    {(user.fullName || user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-900 truncate">
                                  {user.fullName || user.displayName || 'No name'}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {user.providerId === 'google.com' ? 'Google' : 'Email'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              <p className="text-sm text-slate-700 truncate max-w-[180px]" title={user.email || ''}>
                                {user.email || 'N/A'}
                              </p>
                              {user.phone ? (
                                <p className="text-sm text-green-700 font-medium">{user.phone}</p>
                              ) : (
                                <p className="text-xs text-slate-400">No phone</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              {user.companyName ? (
                                <p className="text-sm font-medium text-slate-800 truncate max-w-[150px]" title={user.companyName}>
                                  {user.companyName}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400">No company</p>
                              )}
                              {user.designation && (
                                <p className="text-xs text-slate-500 truncate" title={user.designation}>
                                  {user.designation}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-1">
                              {user.city || user.state || user.country ? (
                                <p className="text-sm text-slate-700">
                                  {[user.city, user.state, user.country].filter(Boolean).join(', ')}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400">No location</p>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${user.profileComplete
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                                }`}>
                                {user.profileComplete ? 'Complete' : 'Incomplete'}
                              </span>
                              <p className="text-xs text-slate-500">
                                {user.updatedAt
                                  ? (() => {
                                    try {
                                      const date = user.updatedAt.toDate
                                        ? user.updatedAt.toDate()
                                        : new Date(user.updatedAt);
                                      return date.toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                      });
                                    } catch {
                                      return '';
                                    }
                                  })()
                                  : ''}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingUser(user)}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                                title="Edit user"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.uid)}
                                disabled={deletingUserId === user.uid}
                                className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                title="Delete user"
                              >
                                {deletingUserId === user.uid ? (
                                  <RefreshCw size={16} className="animate-spin" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Edit User Profile</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={editingUser.fullName || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Email</label>
                  <input
                    type="email"
                    value={editingUser.email || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={editingUser.companyName || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Designation</label>
                  <input
                    type="text"
                    value={editingUser.designation || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, designation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">City</label>
                  <input
                    type="text"
                    value={editingUser.city || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">State</label>
                  <input
                    type="text"
                    value={editingUser.state || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Country</label>
                  <input
                    type="text"
                    value={editingUser.country || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingUser.profileComplete || false}
                      onChange={(e) => setEditingUser({ ...editingUser, profileComplete: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">Profile Complete</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateUser(editingUser)}
                  disabled={savingUser}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddUserModal(false)} />
            <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">Add New User</h3>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Full Name *</label>
                  <input
                    type="text"
                    value={newUser.fullName || ''}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Email *</label>
                  <input
                    type="email"
                    value={newUser.email || ''}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Phone</label>
                  <input
                    type="tel"
                    value={newUser.phone || ''}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Company Name</label>
                  <input
                    type="text"
                    value={newUser.companyName || ''}
                    onChange={(e) => setNewUser({ ...newUser, companyName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Designation</label>
                  <input
                    type="text"
                    value={newUser.designation || ''}
                    onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter designation"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">City</label>
                  <input
                    type="text"
                    value={newUser.city || ''}
                    onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter city"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">State</label>
                  <input
                    type="text"
                    value={newUser.state || ''}
                    onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter state"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Country</label>
                  <input
                    type="text"
                    value={newUser.country || ''}
                    onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter country"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  disabled={savingUser}
                  className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {savingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
