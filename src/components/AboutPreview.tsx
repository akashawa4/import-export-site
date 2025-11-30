import { ArrowRight } from 'lucide-react';

export default function AboutPreview() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              About Our Company
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              We are a leading exporter of premium quality towels, organic cow dung products, and eco-friendly items from India. With years of experience in international trade, we pride ourselves on delivering exceptional products that meet the highest global standards.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our commitment to quality, sustainability, and customer satisfaction has made us a trusted partner for businesses worldwide. From sourcing to shipping, we ensure every step maintains the integrity and excellence our clients expect.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200 text-lg"
            >
              Learn More About Us
              <ArrowRight size={20} />
            </a>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-teal-100 to-blue-100 flex items-center justify-center overflow-hidden shadow-xl">
              <div className="text-center p-8">
                <div className="text-8xl mb-4">🏭</div>
                <p className="text-slate-700 font-medium text-lg">
                  Quality Production Facilities
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-500 rounded-2xl -z-10 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
