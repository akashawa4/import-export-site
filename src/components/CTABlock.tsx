import { MessageCircle, Mail } from 'lucide-react';

export default function CTABlock() {
  return (
    <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-blue-600/50 to-teal-500/50 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
          <div className="w-[40rem] h-[40rem] rounded-full bg-gradient-to-bl from-green-500/50 to-cyan-500/50 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Looking for <span className="text-blue-400">Bulk Orders</span> or <span className="text-green-400">Custom Requirements?</span>
              </h2>
              <p className="mt-6 text-lg text-slate-300 max-w-xl">
                  Get in touch with our team for personalized quotes and export solutions tailored to your needs. We're here to help you scale your business globally.
              </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
              <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-4 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/40"
              >
                  <MessageCircle size={24} className="transition-transform duration-300 group-hover:rotate-12" />
                  <span>WhatsApp Enquiry</span>
              </a>
              <a
                  href="#contact"
                  className="group inline-flex items-center justify-center gap-4 px-6 py-4 bg-white/90 text-slate-800 font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-white/30"
              >
                  <Mail size={24} className="transition-transform duration-300 group-hover:scale-110" />
                  <span>Contact Us via Email</span>
              </a>
          </div>
      </div>
  </section>
  );
}
