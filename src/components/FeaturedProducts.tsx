import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
  onNavigate?: (page: 'home' | 'products' | 'about' | 'contact') => void;
}

const products = [
  {
    id: 1,
    name: 'Premium Towels Collection',
    highlight: 'Export Quality',
    category: 'Towels',
    categorySlug: 'towels',
    image: '/towel/banner.avif',
  },
  {
    id: 2,
    name: 'Cow Dung Products',
    highlight: 'Traditional & Natural',
    category: 'Cow Dung Products',
    categorySlug: 'cow-dung',
    image: '/cow dung/cowbanner/banner.jpg',
  },
];

export default function FeaturedProducts({ onNavigate }: FeaturedProductsProps = {}) {
  const handleProductClick = (categorySlug: string) => {
    // Navigate directly to products - no sign-in required for browsing
    sessionStorage.setItem('navigateToProducts', 'true');
    sessionStorage.setItem('selectedCategory', categorySlug);
    onNavigate?.('products');
  };

  return (
    <section id="products" className="relative py-16 overflow-hidden">
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hero/featureproductbackground.jpg')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'blur(4px)',
          transform: 'scale(1.1)', // Prevents blur white edges
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-900/75 via-slate-800/70 to-blue-900/65" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Featured <span className="text-blue-400">Products</span>
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Explore our handpicked selection of premium export products
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.categorySlug)}
              className="group bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 border border-white/20 cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                  {product.highlight}
                </div>
              </div>

              <div className="p-6 bg-slate-900/60 backdrop-blur-sm">
                <p className="text-sm text-blue-400 font-medium mb-2">
                  {product.category}
                </p>
                <h3 className="text-xl font-bold font-serif text-white mb-4">
                  {product.name}
                </h3>
                <div className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all duration-200">
                  View Details
                  <ArrowRight size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

