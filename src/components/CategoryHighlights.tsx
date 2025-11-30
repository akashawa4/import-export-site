import { Droplet, Leaf, Sparkles } from 'lucide-react';

const categories = [
  {
    icon: Droplet,
    title: 'Towels',
    description: 'Export-quality cotton towels',
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    icon: Leaf,
    title: 'Cow Dung Products',
    description: 'Organic cow dung cakes & dhoop',
    gradient: 'from-teal-600 to-teal-700',
  },
  {
    icon: Sparkles,
    title: 'Organic Items',
    description: 'Natural eco-friendly Indian products',
    gradient: 'from-slate-600 to-slate-700',
  },
];

export default function CategoryHighlights() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover our range of premium export products
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="group cursor-pointer bg-white rounded-xl border-2 border-slate-200 p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {category.title}
                </h3>
                <p className="text-slate-600">
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
