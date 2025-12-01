import { useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

interface Product {
  id: number;
  name: string;
  category: string;
  categorySlug: string;
  productType: string;
  description: string;
  price: string;
  priceValue: number;
  imageEmoji: string;
  highlight?: string;
  createdAt: number;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Cotton Bath Towels',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Bath Towel',
    description: 'Ultra-soft 100% cotton bath towels with superior absorbency. Perfect for luxury hotels and spas.',
    price: '$45.00',
    priceValue: 45,
    imageEmoji: '🧺',
    highlight: 'Best Seller',
    createdAt: 1,
  },
  {
    id: 2,
    name: 'Luxury Hand Towels Set',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Napkin',
    description: 'Set of 6 premium hand towels with elegant borders. Bulk orders available.',
    price: '$32.00',
    priceValue: 32,
    imageEmoji: '🧺',
    highlight: 'Bulk Available',
    createdAt: 2,
  },
  {
    id: 3,
    name: 'Egyptian Cotton Face Towels',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Face Towel',
    description: 'Soft and durable face towels made from premium Egyptian cotton fibers.',
    price: '$18.00',
    priceValue: 18,
    imageEmoji: '🧺',
    createdAt: 3,
  },
  {
    id: 4,
    name: 'Beach Towel Collection',
    category: 'Towels',
    categorySlug: 'towels',
    productType: 'Beach Towel',
    description: 'Large, colorful beach towels perfect for resorts and beach clubs.',
    price: '$52.00',
    priceValue: 52,
    imageEmoji: '🧺',
    createdAt: 4,
  },
  {
    id: 5,
    name: 'Organic Cow Dung Cakes',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Cow Dung Cakes',
    description: 'Traditional handmade cow dung cakes for rituals and eco-friendly purposes.',
    price: '$12.00',
    priceValue: 12,
    imageEmoji: '🌿',
    highlight: 'Traditional',
    createdAt: 5,
  },
  {
    id: 6,
    name: 'Aromatic Dhoop Sticks',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Dhoop Sticks',
    description: 'Pure organic dhoop sticks made from cow dung and natural herbs.',
    price: '$15.00',
    priceValue: 15,
    imageEmoji: '🌿',
    highlight: 'Pure & Organic',
    createdAt: 6,
  },
  {
    id: 7,
    name: 'Natural Incense Cones',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Incense Cones',
    description: 'Handcrafted incense cones with natural fragrances. Chemical-free.',
    price: '$10.00',
    priceValue: 10,
    imageEmoji: '🌿',
    createdAt: 7,
  },
  {
    id: 8,
    name: 'Organic Fertilizer Pellets',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    productType: 'Fertilizer',
    description: 'Rich organic fertilizer made from processed cow dung. Perfect for gardens.',
    price: '$25.00',
    priceValue: 25,
    imageEmoji: '🌿',
    createdAt: 8,
  },
];

interface ProductsPageProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact') => void;
}

export default function ProductsPage({ onNavigate }: ProductsPageProps = {}) {
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((p) => p.productType === selectedType);
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
  }, [selectedCategory, selectedType, sortBy, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('newest');
    setSearchQuery('');
  };

  const towelTypes = ['Bathrobe', 'Bath Towel', 'Beach Towel', 'Face Towel', 'Kitchen Towel', 'Napkin', 'Terry Kitchen Towel'];
  const cowDungTypes = ['Cow Dung Cakes', 'Dhoop Sticks', 'Incense Cones', 'Fertilizer'];
  
  const availableTypes = selectedCategory === 'towels' 
    ? towelTypes 
    : selectedCategory === 'cow-dung' 
    ? cowDungTypes 
    : [];

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
    },
    {
      id: 'cow-dung',
      name: 'Cow Dung Products',
      emoji: '🌿',
      description: 'Organic cow dung cakes & dhoop',
      slug: 'cow-dung',
    },
  ];

  if (viewMode === 'categories') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation onNavigate={onNavigate} />
        <div className="pt-16 pb-20">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Products</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Discover our range of premium export products carefully sourced and crafted for quality and sustainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.slug)}
                  className="group bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
                    <div className="text-8xl group-hover:scale-110 transition-transform duration-300">
                      {category.emoji}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h3>
                    <p className="text-slate-600">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigate={onNavigate} />

      <div className="pt-4">
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
            <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Management Product</h1>
                <p className="text-slate-600 text-xs md:text-sm">Add Product to your store</p>
              </div>
              <button
                onClick={() => {
                  setViewMode('categories');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs md:text-sm text-slate-600 hover:text-slate-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                ← Back
              </button>
            </div>

            <FilterBar
              selectedCategory={selectedCategory}
              onCategoryChange={(cat) => {
                setSelectedCategory(cat);
                setSelectedType('all');
              }}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              availableTypes={availableTypes}
              sortBy={sortBy}
              onSortChange={setSortBy}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            {filteredAndSortedProducts.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs md:text-sm text-slate-600">
                    Showing {filteredAndSortedProducts.length} product
                    {filteredAndSortedProducts.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
