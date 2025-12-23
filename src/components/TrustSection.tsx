import { Globe, Users, TrendingUp, Award } from 'lucide-react';

const statsCards = [
  {
    icon: Globe,
    value: '50+',
    label: 'Countries',
    subtitle: 'Global Reach',
  },
  {
    icon: Users,
    value: '200+',
    label: 'Professionals',
    subtitle: 'Expert Team',
  },
  {
    icon: TrendingUp,
    value: '500M+',
    label: 'Annual Trade',
    subtitle: 'Growth',
  },
  {
    icon: Award,
    value: '25+',
    label: 'Years Experience',
    subtitle: 'Certified',
  },
];

export default function TrustSection() {
  return (
    <section className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Why Choose Us
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-5">
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We bring expertise in international trade, delivering premium quality products
            with unmatched reliability and service.
          </p>
        </div>

        {/* Stats Cards Grid - 2x2 layout like the image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {statsCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-slate-100"
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon size={40} className="text-blue-500" strokeWidth={1.5} />
                </div>

                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-slate-900 mb-1">
                  {card.value}
                </div>

                {/* Label */}
                <div className="text-slate-500 text-sm mb-4">
                  {card.label}
                </div>

                {/* Subtitle */}
                <div className="text-slate-800 font-semibold">
                  {card.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
