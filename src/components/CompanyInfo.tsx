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
    <section className="py-24 overflow-hidden relative">

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">About Our Company</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
              Bridging Markets with <span className="text-blue-400">Integrity</span>
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Amritva Overseas is a leading global import-export merchant dedicated to connecting businesses worldwide with high-quality products from sustainable suppliers.
            </p>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              With over 3+ years of experience in international trade, we specialize in agricultural commodities, textiles, pharmaceuticals, and specialty products. Our commitment to excellence has made us a trusted partner across more than 50 countries.
            </p>

          </div>

          {/* Right Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl transition-all duration-300 border border-white/10 hover:border-blue-400/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 text-blue-300" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mb-2 group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300">
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
