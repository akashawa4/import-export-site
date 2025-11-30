import { MessageCircle, Mail } from 'lucide-react';

export default function AboutCTA() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-teal-600">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Want to know more or discuss bulk orders?
        </h2>
        <p className="text-xl text-blue-50 mb-10">
          Our team is ready to answer your questions and provide personalized export solutions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail size={24} />
            Contact Us
          </a>
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageCircle size={24} />
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </section>
  );
}
