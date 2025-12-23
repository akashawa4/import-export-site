export default function BrandStory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              About Company
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Amritva Overseas is a trusted and growing export-import firm based in India, specialized in the global trade of high-quality Indian products. We are committed to delivering excellence, sustainability, and authenticity in every consignment, serving clients across the globe with integrity and professionalism.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden shadow-md">
              <div className="text-center p-8">
                <div className="text-9xl mb-4">🏭</div>
                <p className="text-slate-700 font-medium text-lg">
                  Quality Manufacturing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
