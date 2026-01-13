import { useState, useRef, useEffect } from 'react';
import { Mail, Copy, Check, ChevronDown } from 'lucide-react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

export default function AboutCTA() {
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

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-6">
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
              <span className="font-semibold text-white">Email:</span> {COMPANY_EMAIL}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Email Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowEmailOptions(!showEmailOptions)}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <Mail size={24} />
                Contact Us
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${showEmailOptions ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {showEmailOptions && (
                <div className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-0 sm:w-64 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                  <div className="p-2">
                    <p className="text-xs text-slate-500 font-semibold uppercase px-3 py-2 text-left">Send via</p>
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

            <a
              href="https://wa.me/919960447001"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <WhatsAppIcon size={24} />
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
