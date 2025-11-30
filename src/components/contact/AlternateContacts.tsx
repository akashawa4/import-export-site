import { Mail, Phone, MessageCircle, Linkedin, Twitter } from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email for detailed enquiries',
    link: 'mailto:info@premiumexports.com',
    linkText: 'Send Email',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Direct phone support for bulk orders',
    link: 'tel:+919876543210',
    linkText: 'Call Now',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Quick responses on WhatsApp Business',
    link: 'https://wa.me/919876543210',
    linkText: 'Chat Now',
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    external: true,
  },
];

export default function AlternateContacts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Other Ways to Connect
          </h2>
          <p className="text-lg text-slate-600">
            Choose the method that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {contactMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.title}
                className={`${method.bgColor} rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className="mb-4">
                  <Icon size={40} className={method.iconColor} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-slate-600 mb-6">
                  {method.description}
                </p>
                <a
                  href={method.link}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all duration-200"
                >
                  {method.linkText}
                  <span>→</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-16 border-t border-slate-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Follow Us
            </h3>
            <p className="text-slate-600 mb-8">
              Stay updated with our latest exports and company news
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-200"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-green-500 hover:text-white transition-all duration-200"
            >
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
