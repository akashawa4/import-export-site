import { Award, Shield, Package, Globe } from 'lucide-react';

const trustPoints = [
  {
    icon: Award,
    title: 'International Export Certified',
    description: 'All products meet global quality standards',
  },
  {
    icon: Shield,
    title: 'Premium Quality Control',
    description: 'Rigorous testing at every production stage',
  },
  {
    icon: Package,
    title: 'Bulk Order Friendly',
    description: 'Flexible quantities for wholesale buyers',
  },
  {
    icon: Globe,
    title: 'Worldwide Shipping',
    description: 'Reliable delivery to all major markets',
  },
];

export default function TrustSection() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Trusted by export buyers worldwide for quality and reliability
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-200 border border-slate-200"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon size={32} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
