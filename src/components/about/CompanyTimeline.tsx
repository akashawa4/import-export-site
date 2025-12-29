const milestones = [
  {
    year: '2023',
    title: 'Company Founded',
    description: 'Started as a small textile export business with a focus on quality towels',
  },
  {
    year: '2024',
    title: 'Expansion',
    description: 'Extended product line to include organic cow dung products and eco-friendly items',
  },
  {
    year: '2025',
    title: 'Global Reach',
    description: 'Achieved presence in 15+ countries with established distribution networks',
  },
  {
    year: '2026',
    title: 'Today',
    description: 'Leading exporter serving 20+ countries with a diverse product portfolio',
  },
];

export default function CompanyTimeline() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/hero/people.webp')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/85"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-slate-300">
            A decade of growth, quality, and global expansion
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-blue-500/30 -translate-x-1/2"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/10 ml-16 md:ml-0 hover:bg-white/15 hover:border-blue-500/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 border-4 border-slate-900 shadow-[0_0_0_4px_rgba(59,130,246,0.3)]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
