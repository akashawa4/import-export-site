import { useEffect, useState, useMemo } from 'react';
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../firebase';
import { Product as CatalogProduct, getImageForType, towelTypesData } from './ProductsPage';

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
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

type Product = Omit<CatalogProduct, 'id'> & { id: string };

export default function AdminPage({ onNavigate }: AdminPageProps = {}) {
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
            <p className="text-sm text-slate-600">Manage product descriptions for your store.</p>
          </div>
          <button
            onClick={() => onNavigate?.('products')}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Storefront
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {loading && <p className="text-slate-600 text-sm">Loading products...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

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
      </main>
    </div>
  );
}
