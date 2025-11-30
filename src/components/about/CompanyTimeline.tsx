const milestones = [
  {
    year: '2010',
    title: 'Company Founded',
    description: 'Started as a small textile export business with a focus on quality towels',
  },
  {
    year: '2014',
    title: 'Expansion',
    description: 'Extended product line to include organic cow dung products and eco-friendly items',
  },
  {
    year: '2018',
    title: 'Global Reach',
    description: 'Achieved presence in 15+ countries with established distribution networks',
  },
  {
    year: '2023',
    title: 'Today',
    description: 'Leading exporter serving 20+ countries with a diverse product portfolio',
  },
];

export default function CompanyTimeline() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Our Journey
          </h2>
          <p className="text-lg text-slate-600">
            A decade of growth, quality, and global expansion
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-300 -translate-x-1/2"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.year}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white rounded-lg p-6 shadow-sm ml-16 md:ml-0">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-blue-600 rounded-full -translate-x-1/2 border-4 border-white"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
