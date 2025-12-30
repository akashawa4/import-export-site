import { Award, TrendingUp, Truck, Package, Leaf } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    text: 'High-quality and 100% authentic products',
  },
  {
    icon: TrendingUp,
    text: 'Competitive pricing',
  },
  {
    icon: Truck,
    text: 'Timely shipments and efficient logistics',
  },
  {
    icon: Package,
    text: 'Customized packaging solutions',
  },
  {
    icon: Leaf,
    text: 'Ethical sourcing and eco-conscious practices',
  },
];

export default function ExportCapabilities() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/3] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-xl relative group">
              <img
                src="/hero/why%20choose%20u%20-%20Copy.JPG"
                alt="Why Choose Us"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white">
              Why Choose Us?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              We are dedicated to providing the best experience for our partners worldwide.
            </p>
            <div className="space-y-4">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-blue-400" />
                    </div>
                    <p className="text-slate-300 font-medium leading-relaxed">
                      {reason.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
