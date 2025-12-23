import { Handshake, ShieldCheck, Leaf, Clock } from 'lucide-react';

export default function CompanyInfo() {
  const features = [
    {
      icon: Handshake,
      title: 'Direct Partnerships',
      description: 'Ethical sourcing directly from producers',
    },
    {
      icon: ShieldCheck,
      title: 'Quality Control',
      description: 'Rigorous compliance standards',
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'Environmentally responsible practices',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock logistics expertise',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span className="text-sm font-semibold text-blue-800 uppercase tracking-wide">About Our Company</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">
              Bridging Markets with <span className="text-blue-700">Integrity</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Amritva Overseas is a leading global import-export merchant dedicated to connecting businesses worldwide with high-quality products from sustainable suppliers.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              With over 25 years of experience in international trade, we specialize in agricultural commodities, textiles, pharmaceuticals, and specialty products. Our commitment to excellence has made us a trusted partner across more than 50 countries.
            </p>

          </div>

          {/* Right Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-slate-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-blue-100 transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
