

interface Category {
  id: string;
  name: string;
  image: string;
  description?: string;
  highlighted?: boolean;
}

interface ProductCategoryGridProps {
  onNavigate?: (page: 'products') => void;
}

export default function ProductCategoryGrid({ onNavigate }: ProductCategoryGridProps) {
  const categories: Category[] = [
    {
      id: 'towels',
      name: 'Towels',
      image: '/towel/banner.avif',
      description: 'Premium export-quality cotton towels',
    },
    {
      id: 'cow-dung',
      name: 'Cow Dung Products',
      image: '/cow dung/cowbanner/banner.jpg',
      description: 'Organic cow dung cakes & eco products',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
          Products
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Discover our range of premium export products carefully sourced and crafted for quality and sustainability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => onNavigate?.('products')}
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="text-3xl font-serif text-white mb-2">{category.name}</h3>
              {category.description && (
                <p className="text-white/90 text-lg">{category.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
