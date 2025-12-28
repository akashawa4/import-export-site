import { Globe, Users, TrendingUp, Award, CheckCircle2 } from 'lucide-react';

const stats = [
  {
    icon: Globe,
    value: '50+',
    label: 'Countries Served',
    description: 'Trusted by partners across continents',
  },
  {
    icon: Users,
    value: '200+',
    label: 'Expert Professionals',
    description: 'Dedicated team ensuring quality',
  },
  {
    icon: TrendingUp,
    value: '500M+',
    label: 'Annual Trade Volume',
    description: 'Consistent growth and reliability',
  },
  {
    icon: Award,
    value: '25+',
    label: 'Years of Excellence',
    description: 'Legacy of trust and integrity',
  },
];

const features = [
  'Premium Quality Assurance',
  'Global Logistics Network',
  'Sustainable Sourcing',
  '24/7 Customer Support',
];

export default function TrustSection() {
  return (
    <section className="py-24 overflow-hidden relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hero/why choose u.avif')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/90"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-start">

          {/* Text Content */}
          <div className="flex-1">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-sm">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
              Excellence in Every <span className="text-blue-400">Shipment</span>
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl">
              We connect the world through quality trade. With unmatched expertise and a commitment to sustainability, we ensure your business moves forward without barriers.
            </p>

            <ul className="grid sm:grid-cols-2 gap-4 mb-10">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 className="text-blue-400 flex-shrink-0" size={20} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button className="bg-blue-600 text-white hover:bg-blue-500 px-8 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1">
              Discover More
            </button>
          </div>

          {/* Stats Grid */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/15"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-blue-500/30">
                      <Icon className="text-blue-300" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                    <h3 className="text-lg font-semibold text-blue-100 mb-2">{stat.label}</h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{stat.description}</p>
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
