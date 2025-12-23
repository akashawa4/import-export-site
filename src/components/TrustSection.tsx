import { Award, Shield, Package, Globe, ArrowRight } from 'lucide-react';

const trustPoints = [
  {
    icon: Award,
    title: 'Export Certified',
    description: 'All products meet international quality standards and compliance requirements.',
    accent: 'bg-blue-600',
    lightAccent: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous multi-stage testing ensures every product exceeds expectations.',
    accent: 'bg-teal-600',
    lightAccent: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
  {
    icon: Package,
    title: 'Bulk Orders',
    description: 'Flexible quantities and competitive pricing for wholesale buyers.',
    accent: 'bg-slate-700',
    lightAccent: 'bg-slate-50',
    iconColor: 'text-slate-700',
  },
  {
    icon: Globe,
    title: 'Global Delivery',
    description: 'Reliable and fast delivery to all major markets across the globe.',
    accent: 'bg-blue-600',
    lightAccent: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '500+', label: 'Happy Clients' },
  { value: '50+', label: 'Countries' },
  { value: '1000+', label: 'Products' },
];

export default function TrustSection() {
  return (
    <section className="py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
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

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="group relative bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${point.lightAccent} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon size={28} className={point.iconColor} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {point.description}
                </p>

                {/* Top accent line */}
                <div className={`absolute top-0 left-6 right-6 h-1 ${point.accent} rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center relative">
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                {/* Divider (hidden on last item and mobile) */}
                {index < stats.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-slate-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Link */}
        <div className="text-center mt-10">
          <a
            href="#about"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 group"
          >
            Learn more about our company
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}
