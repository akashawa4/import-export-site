export default function ContactHero() {
  return (
    <section
      className="pt-32 pb-16 relative"
      style={{
        backgroundImage: `url('/hero/contact.avif')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/70 to-slate-900/90"></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-6">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          Reach out to us for bulk orders, export enquiries, or product information. We're here to help you grow your business.
        </p>
      </div>
    </section>
  );
}
