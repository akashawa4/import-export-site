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
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hero/global connection.avif')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Discover our range of premium export products
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.title}
                className="group cursor-pointer bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-8 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/15 hover:border-blue-400/30 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold font-serif text-white mb-3">
                  {category.title}
                </h3>
                <p className="text-slate-300 group-hover:text-white transition-colors">
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
