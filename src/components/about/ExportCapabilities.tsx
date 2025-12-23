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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 md:order-1">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center overflow-hidden shadow-md">
              <div className="text-center p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">💎</div>
                    <p className="text-sm font-medium text-slate-700">Quality</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">💰</div>
                    <p className="text-sm font-medium text-slate-700">Price</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">🚀</div>
                    <p className="text-sm font-medium text-slate-700">Speed</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-sm font-medium text-slate-700">Eco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Why Choose Us?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We are dedicated to providing the best experience for our partners worldwide.
            </p>
            <div className="space-y-4">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <div key={reason.text} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-teal-600" />
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">
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
