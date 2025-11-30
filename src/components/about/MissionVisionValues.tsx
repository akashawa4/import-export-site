import { Target, Eye, Heart } from 'lucide-react';

const pillars = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To deliver premium Indian export products that meet international quality standards while supporting sustainable practices and fair trade.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become the most trusted global supplier of quality towels and organic products from India, expanding to new markets while maintaining excellence.',
  },
  {
    icon: Heart,
    title: 'Our Values',
    description: 'Quality first, sustainable sourcing, transparency in business, ethical manufacturing, and building long-term partnerships with our clients.',
  },
];

export default function MissionVisionValues() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Icon size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {pillar.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
