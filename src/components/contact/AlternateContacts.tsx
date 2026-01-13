import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Linkedin, Facebook, Instagram, Copy, Check, ChevronDown } from 'lucide-react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

export default function AlternateContacts() {
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmailOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(COMPANY_EMAIL);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = COMPANY_EMAIL;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  const emailOptions = [
    { name: 'Gmail', icon: '📧', url: `https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_EMAIL}&su=Enquiry%20from%20Website` },
    { name: 'Outlook', icon: '📬', url: `https://outlook.live.com/mail/0/deeplink/compose?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Website` },
    { name: 'Yahoo Mail', icon: '📨', url: `https://compose.mail.yahoo.com/?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Website` },
    { name: 'Default Mail App', icon: '💻', url: `mailto:${COMPANY_EMAIL}?subject=Enquiry%20from%20Website` },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Direct phone support for bulk orders',
      link: 'tel:+919960447001',
      linkText: 'Call Now',
      bgColor: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      icon: WhatsAppIcon,
      title: 'WhatsApp',
      description: 'Quick responses on WhatsApp Business',
      link: 'https://wa.me/919960447001',
      linkText: 'Chat Now',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400',
      external: true,
    },
  ];

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Other Ways to Connect
          </h2>
          <p className="text-lg text-slate-300">
            Choose the method that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Email Card with Dropdown */}
          <div
            className="bg-blue-500/20 rounded-xl p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative"
            ref={dropdownRef}
          >
            <div className="mb-4">
              <Mail size={40} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold font-serif text-white mb-2">
              Email Us
            </h3>
            <p className="text-slate-300 mb-6">
              Send us an email for detailed enquiries
            </p>
            <button
              onClick={() => setShowEmailOptions(!showEmailOptions)}
              className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all duration-200"
            >
              Send Email
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${showEmailOptions ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown */}
            {showEmailOptions && (
              <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase px-3 py-2">Send via</p>
                  {emailOptions.map((option) => (
                    <a
                      key={option.name}
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowEmailOptions(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="font-medium">{option.name}</span>
                    </a>
                  ))}
                  <div className="border-t border-slate-100 my-2" />
                  <button
                    onClick={() => {
                      handleCopyEmail();
                      setShowEmailOptions(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors w-full"
                  >
                    {emailCopied ? (
                      <>
                        <Check size={18} className="text-green-600" />
                        <span className="font-medium text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span className="font-medium">Copy Email Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Other contact methods */}
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
                <h3 className="text-xl font-bold font-serif text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-slate-300 mb-6">
                  {method.description}
                </p>
                <a
                  href={method.link}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:gap-3 transition-all duration-200"
                >
                  {method.linkText}
                  <span>→</span>
                </a>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold font-serif text-white mb-4">
              Follow Us
            </h3>
            <p className="text-slate-300 mb-8">
              Stay updated with our latest exports and company news
            </p>
          </div>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.linkedin.com/in/amritva-overseas-038bb7379"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#0A66C2]/20 rounded-lg flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-200"
              title="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.facebook.com/share/17s5S1W8Br/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#1877F2]/20 rounded-lg flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-200"
              title="Facebook"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://www.instagram.com/amritva_7151"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-gradient-to-br from-[#F58529]/20 via-[#DD2A7B]/20 to-[#8134AF]/20 rounded-lg flex items-center justify-center text-[#E1306C] hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#DD2A7B] hover:to-[#8134AF] hover:text-white transition-all duration-200"
              title="Instagram"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://wa.me/919960447001"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-[#25D366]/20 rounded-lg flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-200"
              title="WhatsApp"
            >
              <WhatsAppIcon size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
