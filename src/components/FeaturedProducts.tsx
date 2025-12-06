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
    image: '/towel/Towelmain/banner.jpg',
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
  return (
    <section id="products" className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore our handpicked selection of premium export products
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                // Set flag to show products directly (skip categories)
                sessionStorage.setItem('navigateToProducts', 'true');
                // Store the selected category slug
                sessionStorage.setItem('selectedCategory', product.categorySlug);
                onNavigate?.('products');
              }}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border border-slate-200 cursor-pointer"
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

              <div className="p-6">
                <p className="text-sm text-teal-600 font-medium mb-2">
                  {product.category}
                </p>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {product.name}
                </h3>
                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all duration-200">
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
