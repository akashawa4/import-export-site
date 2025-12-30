export default function AboutProducts() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-12 text-center">
          Our Products
        </h2>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Terry Towels */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="h-80 bg-slate-800/50 relative overflow-hidden group">
              <img
                src="/hero/banner1.avif"
                alt="Premium Terry Towels"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ objectPosition: '30% center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold font-serif text-white mb-4">1. Terry Towels</h3>
              <p className="text-slate-300 leading-relaxed">
                We offer a wide range of premium terry towels made from 100% high-quality cotton. These towels are soft, highly absorbent, and durable, suitable for personal, commercial, and hospitality use. Available in various sizes, colors, GSM ranges, and styles including bath towels, hand towels, and face towels. Customization options are available as per buyer requirements.
              </p>
            </div>
          </div>

          {/* Cow Dung Products */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:bg-white/15 transition-all duration-300">
            <div className="h-80 bg-slate-800/50 relative overflow-hidden group">
              <img
                src="/hero/banner.jpg"
                alt="Organic Cow Dung Products"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ objectPosition: 'center center' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-60"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold font-serif text-white mb-4">2. Cow Dung Products</h3>
              <p className="text-slate-300 leading-relaxed">
                Our range includes dried cow dung cakes, cow dung powder, and incense made from pure desi cow dung. These eco-friendly products are commonly used for religious rituals, natural fertilizers in organic farming, and sustainable fuel alternatives. We ensure proper drying, hygiene, and safe packaging for domestic and international supply.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-300 font-medium">
            At Amritva Overseas, we are committed to offering quality products that meet international standards. From sourcing to packaging, every step is handled with care to ensure customer satisfaction, timely delivery, and lasting value.
          </p>
        </div>
      </div>
    </section>
  );
}
