import { Target, Eye } from 'lucide-react';

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
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-200"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4 sm:mb-6">
                  <Icon size={24} className="sm:w-7 sm:h-7 text-blue-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  {pillar.title}
                </h3>
                <div className="text-sm sm:text-base text-slate-300 leading-relaxed">
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
