import { MessageCircle, Mail } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want to know more or discuss bulk orders?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Our team is ready to answer your questions and provide personalized export solutions.
          </p>

          <div className="mb-10 space-y-2 text-slate-300">
            <p className="text-lg">
              <span className="font-semibold text-white">Contact Number:</span> +91 9960447001
            </p>
            <p className="text-lg">
              <span className="font-semibold text-white">Email:</span> amritva009@amritvaoverseas.com
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:amritva009@amritvaoverseas.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Mail size={24} />
              Contact Us
            </a>
            <a
              href="https://wa.me/919960447001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageCircle size={24} />
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
