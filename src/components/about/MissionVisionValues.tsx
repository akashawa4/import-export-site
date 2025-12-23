import { Target, Eye, Heart } from 'lucide-react';

const pillars = [
  {
    icon: Eye,
    title: 'Our Vision',
    description: 'To become a globally recognized and respected name in the export-import industry by promoting traditional Indian products and ensuring customer satisfaction through reliable service.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    description: (
      <ul className="list-disc pl-4 space-y-2 text-left">
        <li>To provide premium quality goods that meet international standards.</li>
        <li>To build long-term relationships with global partners through transparency and timely delivery.</li>
        <li>To empower local artisans and rural suppliers by connecting them to international markets.</li>
      </ul>
    ),
  },
];

export default function MissionVisionValues() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <div className="text-slate-600 leading-relaxed">
                  {pillar.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
