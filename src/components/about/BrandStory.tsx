export default function BrandStory() {
  return (
    <section className="py-12 sm:py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              About Company
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Amritva Overseas is a trusted and growing export-import firm based in India, specialized in the global trade of high-quality Indian products. We are committed to delivering excellence, sustainability, and authenticity in every consignment, serving clients across the globe with integrity and professionalism.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-start justify-end overflow-hidden shadow-xl relative group">
              <img
                src="/hero/qualitymanu.avif"
                alt="Quality Manufacturing"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="relative z-10 text-right p-6 sm:p-8">
                <p className="text-white font-bold font-serif text-2xl sm:text-3xl drop-shadow-md">
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
