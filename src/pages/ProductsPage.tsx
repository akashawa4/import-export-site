import { useState, useMemo, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../firebase';
import { getProductSpecifications } from '../data/productSpecifications';

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  productType: string; // Main type (e.g., "Bath Towel", "Kitchen Towel")
  productSubtype?: string; // Specific subtype (e.g., "Premium / Luxury Hotel Bath Towel")
  description: string;
  price: string;
  priceValue: number;
  imageEmoji: string;
  highlight?: string;
  createdAt: number;
  imageUrl?: string;
}

export const productImageMap: Record<string, string> = {
  // Towel products
  'bath towel': '/towel/bathtowel/bathtowel (1).jpg',
  napkin: '/towel/napkin/hand towel (1).jpg',
  'face towel': '/towel/face towel/face towel (1).jpg',
  'beach towel': '/towel/beach towel/beach towel (1).jpg',
  bathrobe: '/towel/bathrobe/bathrobe (1).jpg',
  'kitchen towel': '/towel/kitchn towel/kitchn towel (1).jpg',
  'terry kitchen towel': '/towel/terry kitchen towel/terry kitchen towel (1).jpg',
  // Cow Dung products
  'spiritual use': '/hero/dungspritual.avif',
  'fertilizer use': '/hero/dungfertili.avif',
};

// Keep backwards compatibility
export const towelImageMap = productImageMap;

export const getImageForType = (productType: string) => {
  return productImageMap[productType?.toLowerCase()] || undefined;
};

const ADMIN_EMAIL = 'admin@123.com';

export const demoProducts: Product[] = [
  // Towels - Category 1: 7 Products
  {
    id: '1',
    name: 'Premium Bathrobe',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bathrobe',
    description: 'Soft, premium terry or waffle fabric bathrobe with high absorbency and quick-dry features. Perfect for hotels, spas, and home use. Available in sizes S, M, L, XL with length ~105–125 cm.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🧖',
    highlight: 'Premium Quality',
    createdAt: 1,
    imageUrl: getImageForType('Bathrobe'),
  },
  {
    id: '2',
    name: 'Thick Terry Bath Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    description: 'Plush, durable thick terry cotton bath towel with high absorbency. Standard size: 70 × 140 cm (Optional: 75 × 150 cm). Ideal for luxury hotels and everyday use.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🛁',
    highlight: 'Best Seller',
    createdAt: 2,
    imageUrl: getImageForType('Bath Towel'),
  },
  {
    id: '3',
    name: 'Stylish Beach Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    description: 'Large, soft terry fabric beach towel with fast-drying properties and stylish prints. Standard size: 80 × 160 cm (Optional: 90 × 180 cm). Perfect for resorts and beach clubs.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🏖️',
    highlight: 'Fast-Drying',
    createdAt: 3,
    imageUrl: getImageForType('Beach Towel'),
  },
  {
    id: '4',
    name: 'Gentle Face Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    description: 'Gentle, skin-friendly face towel designed for facial care and skincare routines. Standard size: 30 × 30 cm (Optional: 33 × 33 cm). Ultra-soft texture for sensitive skin.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '✨',
    highlight: 'Skin-Friendly',
    createdAt: 4,
    imageUrl: getImageForType('Face Towel'),
  },
  {
    id: '5',
    name: 'Durable Kitchen Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Kitchen Towel',
    description: 'Durable cotton kitchen towel perfect for utensils, surfaces, and dish handling. Standard size: 40 × 60 cm (Optional: 45 × 70 cm). Long-lasting quality for everyday kitchen use.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🍽️',
    highlight: 'Durable',
    createdAt: 5,
    imageUrl: getImageForType('Kitchen Towel'),
  },
  {
    id: '6',
    name: 'Cotton Napkins',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    description: 'Premium cotton or blended fabric napkins for home dining, restaurants, and events. Available sizes: 30 × 30 cm and 40 × 40 cm. Elegant and reusable.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🍴',
    highlight: 'Eco-Friendly',
    createdAt: 6,
    imageUrl: getImageForType('Napkin'),
  },
  {
    id: '7',
    name: 'Terry Kitchen Towel',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Terry Kitchen Towel',
    description: 'Thick, extra-absorbent, and durable terry kitchen towel for dish drying, spill soaking, and cleaning. Standard size: 40 × 60 cm (Optional: 38 × 63 cm). Heavy-duty performance.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🧽',
    highlight: 'Extra-Absorbent',
    createdAt: 7,
    imageUrl: getImageForType('Terry Kitchen Towel'),
  },
  // Cow Dung Products - Category 2: 2 Products
  {
    id: '8',
    name: 'Cow Dung Cake - Fertilizer Use',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Fertilizer Use',
    productSubtype: 'Cake & Powdered Form',
    description: 'Natural, sun-dried cow dung discs available in cake and powdered form. Used as organic slow-release fertilizer that improves soil and adds NPK. Also serves as compost booster and organic pesticide preparation. 100% natural, eco-friendly, and cost-effective for organic farming.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🌱',
    highlight: 'Organic Fertilizer',
    createdAt: 8,
    imageUrl: getImageForType('Fertilizer Use'),
  },
  {
    id: '9',
    name: 'Cow Dung Cake - Spiritual Use',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Spiritual Use',
    productSubtype: 'Traditional & Ritual',
    description: 'Pure cow dung cakes with organic residue for religious and cultural rituals including Havan and Pooja. Also serves as natural mosquito repellent, fuel source, and construction/insulation material for mud houses. Long shelf life when dried properly.',
    price: 'Contact for Price',
    priceValue: 0,
    imageEmoji: '🕉️',
    highlight: 'Traditional',
    createdAt: 9,
    imageUrl: getImageForType('Spiritual Use'),
  },
];

// Bath Line product types - exported for use in AdminPage
export const towelTypesData: Record<string, { name: string; subtypes: string[] }> = {
  'Bathrobe': {
    name: 'Bathrobe',
    subtypes: ['Terry Bathrobe', 'Waffle Bathrobe']
  },
  'Bath Towel': {
    name: 'Bath Towel',
    subtypes: ['Thick Terry Cotton']
  },
  'Beach Towel': {
    name: 'Beach Towel',
    subtypes: ['Soft Terry Fabric']
  },
  'Face Towel': {
    name: 'Face Towel',
    subtypes: ['Skin-Friendly']
  },
  'Kitchen Towel': {
    name: 'Kitchen Towel',
    subtypes: ['Durable Cotton']
  },
  'Napkin': {
    name: 'Napkin',
    subtypes: ['Cotton Napkin', 'Blended Fabric Napkin']
  },
  'Terry Kitchen Towel': {
    name: 'Terry Kitchen Towel',
    subtypes: ['Thick Terry']
  }
};

interface EnquiryFormProps {
  product: Product;
  onClose: () => void;
}

function EnquiryForm({ product, onClose }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    quantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format the message for WhatsApp
    const whatsappMessage = `*Product Enquiry*\n\n` +
      `*Product:* ${product.name}\n` +
      `*Category:* ${product.category}\n` +
      `*Type:* ${product.productType || 'N/A'}\n` +
      `*Price:* ${product.price}\n\n` +
      `*Customer Details:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Quantity: ${formData.quantity || 'Not specified'}\n\n` +
      `*Message:*\n${formData.message || 'No additional message'}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // WhatsApp API URL
    const whatsappUrl = `https://wa.me/919960447001?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Close the form
    onClose();

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      quantity: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="+91 1234567890"
        />
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">
          Quantity
        </label>
        <input
          type="text"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          placeholder="e.g., 100 pieces"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
          Additional Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
          placeholder="Any specific requirements or questions..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Send via WhatsApp
        </button>
      </div>
    </form>
  );
}

interface ProductsPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact' | 'admin') => void;
}

export default function ProductsPage({ onNavigate }: ProductsPageProps = {}) {
  // Check if we should go directly to products view (from homepage card click)
  const shouldShowProductsDirectly = sessionStorage.getItem('navigateToProducts') === 'true';
  const savedCategory = sessionStorage.getItem('selectedCategory') || 'all';
  const [viewMode, setViewMode] = useState<'categories' | 'products'>(shouldShowProductsDirectly ? 'products' : 'categories');
  const [selectedCategory, setSelectedCategory] = useState(savedCategory);

  // Clear the flags after using them
  useEffect(() => {
    if (shouldShowProductsDirectly) {
      sessionStorage.removeItem('navigateToProducts');
      sessionStorage.removeItem('selectedCategory');
    }
  }, [shouldShowProductsDirectly]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedTowelType, setSelectedTowelType] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        if (snapshot.empty) {
          setProducts(demoProducts);
        } else {
          const list: Product[] = snapshot.docs.map((d) => {
            const data = d.data() as any;
            const imageFromType = getImageForType(data.productType ?? '');

            let priceValue = Number(data.priceValue);
            if (Number.isNaN(priceValue)) {
              const numericFromString = parseFloat(String(data.price || '').replace(/[^0-9.]/g, ''));
              priceValue = Number.isNaN(numericFromString) ? 0 : numericFromString;
            }
            const priceString = data.price
              ? String(data.price).replace(/^\$/, '₹')
              : `₹${priceValue.toFixed(2)}`;

            return {
              // Use Firestore document ID to guarantee uniqueness
              id: d.id,
              name: data.name ?? '',
              category: data.category ?? '',
              categorySlug: data.categorySlug ?? 'towels',
              productType: data.productType ?? '',
              productSubtype: data.productSubtype,
              description: data.description ?? '',
              price: priceString,
              priceValue,
              imageEmoji: data.imageEmoji ?? '🧺',
              highlight: data.highlight,
              createdAt: data.createdAt ?? 0,
              imageUrl: data.imageUrl ?? imageFromType,
            };
          });
          setProducts(list);
        }
      } catch (err: any) {
        console.error('Failed to load products from Firestore', err);
        setLoadError(err.message || 'Failed to load products');
        setProducts(demoProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAdmin(user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
    });
    return unsubscribe;
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (selectedProduct || showEnquiryForm || showAuthPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProduct, showEnquiryForm, showAuthPrompt]);

  // Handle enquiry - check if user is signed in first
  const handleEnquiryClick = () => {
    if (!currentUser) {
      setShowAuthPrompt(true);
    } else {
      setShowEnquiryForm(true);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by main towel type if selected
    if (selectedCategory === 'towels' && selectedTowelType) {
      filtered = filtered.filter((p) => p.productType === selectedTowelType);
    }

    // Filter by subtype if selected
    if (selectedType !== 'all') {
      // Filter by subtype if it exists, otherwise by productType
      filtered = filtered.filter((p) =>
        (p.productSubtype && p.productSubtype === selectedType) ||
        (!p.productSubtype && p.productType === selectedType)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    const sorted = [...filtered];

    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return sorted;
  }, [products, selectedCategory, selectedTowelType, selectedType, sortBy, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedTowelType('');
    setSortBy('newest');
    setSearchQuery('');
  };

  const towelTypes = Object.keys(towelTypesData);
  const cowDungTypes = ['Fertilizer Use', 'Spiritual Use'];

  // Get available types based on category and selected towel type
  const availableTypes = useMemo(() => {
    if (selectedCategory === 'towels') {
      if (selectedTowelType && towelTypesData[selectedTowelType]) {
        return towelTypesData[selectedTowelType].subtypes;
      }
      return []; // Show empty if no towel type selected (subtypes will show in dropdown)
    } else if (selectedCategory === 'cow-dung') {
      return cowDungTypes;
    }
    return [];
  }, [selectedCategory, selectedTowelType]);

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setViewMode('products');
  };

  const categories = [
    {
      id: 'towels',
      name: 'Towels',
      emoji: '🧺',
      description: 'Premium export-quality cotton towels',
      slug: 'towels',
      image: '/towel/Towelmain/banner.jpg',
    },
    {
      id: 'cow-dung',
      name: 'Cow Dung Products',
      emoji: '🌿',
      description: 'Organic cow dung cakes & dhoop',
      slug: 'cow-dung',
      image: '/cow dung/cowbanner/banner.jpg',
    },
  ];

  if (viewMode === 'categories') {
    return (
      <div className="min-h-screen relative">
        {/* Background Image with Blur */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: `url('/hero/productpage.avif')`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            filter: 'blur(4px)',
            transform: 'scale(1.1)',
          }}
        />
        {/* Dark Overlay */}
        <div className="fixed inset-0 z-0 bg-gradient-to-br from-slate-900/75 via-slate-800/70 to-blue-900/65" />

        <Navigation onNavigate={onNavigate} activePage="products" />
        <div className="py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
                Our <span className="text-blue-400">Products</span>
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Discover our range of premium export products carefully sourced and crafted for quality and sustainability.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.slug)}
                  className="group bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 border border-white/20 cursor-pointer"
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                      {category.id === 'towels' ? 'Export Quality' : 'Traditional & Natural'}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-900/60 backdrop-blur-sm">
                    <p className="text-sm text-blue-400 font-medium mb-2">
                      {category.name}
                    </p>
                    <h3 className="text-xl font-bold font-serif text-white mb-4">
                      {category.id === 'towels' ? 'Premium Towels Collection' : 'Cow Dung Products'}
                    </h3>
                    <div className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all duration-200">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative z-10">
          <Footer onNavigate={onNavigate} />
        </div>
      </div>
    );
  }

  // Dynamic background based on selected category
  const getBackgroundImage = () => {
    if (selectedCategory === 'cow-dung') {
      return '/hero/cowdungbackground.avif';
    }
    return '/hero/productpage.avif';
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image - Dynamic based on category */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('${getBackgroundImage()}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/75"></div>
      </div>

      <Navigation onNavigate={onNavigate} activePage="products" />

      <div className="pt-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-serif text-white mb-1">Our Products</h1>
                <p className="text-slate-300 text-xs md:text-sm">Browse our premium collection</p>
              </div>
              <button
                onClick={() => {
                  setViewMode('categories');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSelectedTowelType('');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs md:text-sm text-white hover:text-blue-300 border border-white/30 rounded-lg hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                ← Back to Categories
              </button>
            </div>

            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setSelectedType('all');
                setSelectedTowelType('');
              }}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              availableTypes={availableTypes}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedTowelType={selectedTowelType}
              onTowelTypeChange={setSelectedTowelType}
              towelTypes={towelTypes}
            />
            {loadError && (
              <div className="text-sm text-red-400 mt-2">
                {loadError}
              </div>
            )}
          </div>
        </div>

        <div className="bg-transparent">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {isLoading ? (
              <p className="text-sm text-slate-300">Loading products...</p>
            ) : filteredAndSortedProducts.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-slate-300">
                    Showing {filteredAndSortedProducts.length} product
                    {filteredAndSortedProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      name={product.name}
                      category={product.category}
                      description={product.description}
                      price={product.price}
                      imageEmoji={product.imageEmoji}
                      imageUrl={product.imageUrl}
                      highlight={product.highlight}
                      showAdminControls={isAdmin}
                      onEdit={() => onNavigate?.('admin')}
                      onClick={() => setSelectedProduct(product)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Footer onNavigate={onNavigate} />
      </div>

      {/* Product detail modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1050] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProduct(null)}
          ></div>
          <div className="relative z-[1051] w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] flex flex-col">
            <div className="flex flex-col md:flex-row overflow-y-auto">
              {/* Image left */}
              <div className="md:w-1/2 relative flex-shrink-0">
                {selectedProduct.imageUrl ? (
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-48 sm:h-64 md:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-64 md:h-full flex items-center justify-center bg-slate-100 text-6xl sm:text-7xl">
                    {selectedProduct.imageEmoji}
                  </div>
                )}
                {/* Mobile close button - over image */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 hover:bg-white shadow-md transition md:hidden min-h-0"
                  aria-label="Close product details"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
              {/* Info right */}
              <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col gap-3 sm:gap-4 overflow-y-auto">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                      {selectedProduct.category}
                    </p>
                    <h2 className="mt-1 text-xl sm:text-2xl md:text-3xl font-bold font-serif text-slate-900">
                      {selectedProduct.name}
                    </h2>
                    {selectedProduct.productType && (
                      <p className="mt-1 text-sm text-slate-600">
                        Type: <span className="font-semibold">{selectedProduct.productType}</span>
                      </p>
                    )}
                  </div>
                  {/* Desktop close button - top right of content card */}
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="hidden md:inline-flex p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition min-h-0"
                    aria-label="Close product details"
                  >
                    <span className="sr-only">Close</span>
                    ✕
                  </button>
                </div>

                {selectedProduct.highlight && (
                  <span className="inline-flex self-start rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {selectedProduct.highlight}
                  </span>
                )}

                <p className="text-sm md:text-base text-slate-700 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Product Specifications */}
                {(() => {
                  const specs = getProductSpecifications(selectedProduct.productType);
                  if (specs) {
                    return (
                      <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                        <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Product Specifications</h3>
                        <div className="space-y-2">
                          {specs.material && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Material:</span>
                              <span className="text-slate-600 ml-2">{specs.material}</span>
                            </div>
                          )}
                          {specs.features && specs.features.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Features:</span>
                              <span className="text-slate-600 ml-2">{specs.features.join(', ')}</span>
                            </div>
                          )}
                          {specs.use && specs.use.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Use:</span>
                              <span className="text-slate-600 ml-2">{specs.use.join(', ')}</span>
                            </div>
                          )}
                          {specs.sizes && specs.sizes.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Sizes:</span>
                              <span className="text-slate-600 ml-2">{specs.sizes.join(', ')}</span>
                            </div>
                          )}
                          {specs.dimensions && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Dimensions:</span>
                              <span className="text-slate-600 ml-2">{specs.dimensions}</span>
                            </div>
                          )}
                          {specs.length && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Length:</span>
                              <span className="text-slate-600 ml-2">{specs.length}</span>
                            </div>
                          )}
                          {specs.applications && specs.applications.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Applications:</span>
                              <ul className="mt-1 ml-6 list-disc text-slate-600 space-y-1">
                                {specs.applications.map((app, idx) => (
                                  <li key={idx}>{app}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {specs.benefits && specs.benefits.length > 0 && (
                            <div className="text-sm">
                              <span className="font-semibold text-slate-700">Benefits:</span>
                              <ul className="mt-1 ml-6 list-disc text-slate-600 space-y-1">
                                {specs.benefits.map((benefit, idx) => (
                                  <li key={idx}>{benefit}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">Price</p>
                    <p className="text-2xl font-bold text-slate-900">{selectedProduct.price}</p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>Category: {selectedProduct.category}</p>
                    {selectedProduct.productType && <p>Type: {selectedProduct.productType}</p>}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                  <button
                    onClick={handleEnquiryClick}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-full bg-slate-900 text-white px-4 sm:px-5 py-2.5 sm:py-2 text-sm font-semibold hover:bg-slate-800 transition min-h-0"
                  >
                    Enquire Now
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setSelectedProduct(null);
                        onNavigate?.('admin');
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-blue-600 text-blue-800 px-4 py-2 text-sm font-semibold hover:bg-blue-50 transition"
                    >
                      Edit in Admin Panel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enquiry Form Modal */}
      {showEnquiryForm && selectedProduct && (
        <div className="fixed inset-0 z-[1060] flex items-center justify-center px-4 py-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowEnquiryForm(false)}
          ></div>
          <div className="relative z-[1061] w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex-shrink-0 p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900">Product Enquiry</h3>
                <button
                  onClick={() => setShowEnquiryForm(false)}
                  className="p-2 rounded-full hover:bg-slate-100 transition"
                  aria-label="Close enquiry form"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-6 pt-4">
                <div className="mb-4 p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Product:</p>
                  <p className="font-semibold text-slate-900">{selectedProduct.name}</p>
                  <p className="text-sm text-slate-600 mt-1">Price: {selectedProduct.price}</p>
                </div>

                <EnquiryForm
                  product={selectedProduct}
                  onClose={() => setShowEnquiryForm(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-[1070] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowAuthPrompt(false)}
          ></div>
          <div className="relative z-[1071] w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Sign In Required</h3>
              <p className="text-slate-600 text-sm">
                Please sign in to your account to send enquiries and get pricing information.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAuthPrompt(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-full font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAuthPrompt(false);
                    // Navigate to home (the sign in modal is in Navigation)
                    onNavigate?.('home');
                    // Small delay then trigger sign in modal via session storage
                    sessionStorage.setItem('openSignIn', 'true');
                  }}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
