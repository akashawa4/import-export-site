import { MessageCircle, Mail } from 'lucide-react';

export default function CTABlock() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Looking for Bulk Orders or Custom Requirements?
        </h2>
        <p className="text-xl text-blue-50 mb-10 max-w-2xl mx-auto">
          Get in touch with our team for personalized quotes and export solutions tailored to your needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageCircle size={24} />
            WhatsApp Enquiry
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail size={24} />
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
