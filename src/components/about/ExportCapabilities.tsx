import { Globe, Package, Award, Leaf, CheckCircle, TrendingUp } from 'lucide-react';

const capabilities = [
  {
    icon: Globe,
    text: 'Export to 20+ countries across Asia, Europe, Middle East, and Africa',
  },
  {
    icon: Package,
    text: 'Bulk order fulfillment with flexible minimum order quantities',
  },
  {
    icon: Award,
    text: 'Export certifications including quality and organic standards',
  },
  {
    icon: CheckCircle,
    text: 'Multi-stage quality control and inspection processes',
  },
  {
    icon: Leaf,
    text: 'Eco-friendly sourcing from verified sustainable suppliers',
  },
  {
    icon: TrendingUp,
    text: 'Scalable production capacity to meet growing demand',
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
                    <div className="text-4xl mb-2">🧺</div>
                    <p className="text-sm font-medium text-slate-700">Towels</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-sm font-medium text-slate-700">Organic</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-sm font-medium text-slate-700">Export</p>
                  </div>
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="text-4xl mb-2">✓</div>
                    <p className="text-sm font-medium text-slate-700">Quality</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Manufacturing & Export Capabilities
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our comprehensive export capabilities ensure seamless delivery of quality products to your destination.
            </p>
            <div className="space-y-4">
              {capabilities.map((capability) => {
                const Icon = capability.icon;
                return (
                  <div key={capability.text} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={20} className="text-teal-600" />
                    </div>
                    <p className="text-slate-700 leading-relaxed pt-1.5">
                      {capability.text}
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
