import { Award, Globe, Users, TrendingUp } from 'lucide-react';

export default function CompanyInfo() {
  const stats = [
    {
      icon: Globe,
      label: 'Global Reach',
      value: '50+',
      description: 'Countries',
    },
    {
      icon: Users,
      label: 'Expert Team',
      value: '200+',
      description: 'Professionals',
    },
    {
      icon: TrendingUp,
      label: 'Growth',
      value: '500M+',
      description: 'Annual Trade',
    },
    {
      icon: Award,
      label: 'Certified',
      value: '25+',
      description: 'Years Experience',
    },
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-6">
              Our Value Chain
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Amritva Overseas is a leading global import-export merchant dedicated to connecting businesses worldwide with high-quality products from sustainable suppliers.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              With over 25 years of experience in international trade, we specialize in agricultural commodities, textiles, pharmaceuticals, and specialty products. Our commitment to excellence, sustainability, and fair partnerships has made us a trusted partner for businesses across more than 50 countries.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-slate-700">Direct partnerships with ethical suppliers and producers</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-slate-700">Rigorous quality control and compliance standards</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-slate-700">Sustainable and environmentally responsible practices</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
                <p className="text-slate-700">24/7 customer support and logistics expertise</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-8 border border-blue-100 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mb-3">
                    <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-sm text-slate-600">{stat.description}</p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
