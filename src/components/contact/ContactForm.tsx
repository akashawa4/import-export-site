import { useState, useRef, useEffect } from 'react';
import { Mail, Phone, Globe, MapPin, Copy, Check, ChevronDown } from 'lucide-react';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'towels',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailOptions, setShowEmailOptions] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const emailDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailDropdownRef.current && !emailDropdownRef.current.contains(event.target as Node)) {
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
      // Fallback for older browsers
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
    {
      name: 'Gmail',
      icon: '📧',
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_EMAIL}&su=Enquiry%20from%20Website`,
    },
    {
      name: 'Outlook',
      icon: '📬',
      url: `https://outlook.live.com/mail/0/deeplink/compose?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Website`,
    },
    {
      name: 'Yahoo Mail',
      icon: '📨',
      url: `https://compose.mail.yahoo.com/?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Website`,
    },
    {
      name: 'Default Mail App',
      icon: '💻',
      url: `mailto:${COMPANY_EMAIL}?subject=Enquiry%20from%20Website`,
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Format the category name for display
    const categoryNames: Record<string, string> = {
      'towels': 'Towels',
      'cow-dung': 'Cow Dung Products',
      'organic': 'Organic Items',
      'other': 'Other Enquiry',
    };

    // Construct the WhatsApp message with all form data
    const message = `*New Enquiry from Website*

*Name:* ${formData.name}

*Email:* ${formData.email}

*Phone:* ${formData.phone}

*Product Category:* ${categoryNames[formData.category] || formData.category}

*Message:*
${formData.message}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp URL with phone number and message
    const whatsappUrl = `https://wa.me/919960447001?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Reset form and show success message
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      category: 'towels',
      message: '',
    });
    setIsLoading(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section className="py-16 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold font-serif text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                We'd love to hear from you. Choose your preferred way to connect.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4" ref={emailDropdownRef}>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={24} className="text-blue-600" />
                </div>
                <div className="relative flex-1">
                  <h3 className="font-semibold text-white mb-1">Email</h3>
                  <button
                    onClick={() => setShowEmailOptions(!showEmailOptions)}
                    className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors group"
                  >
                    <span>{COMPANY_EMAIL}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${showEmailOptions ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Email Options Dropdown */}
                  {showEmailOptions && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-200">
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
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Phone</h3>
                  <a
                    href="tel:+919960447001"
                    className="block text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    +91 9960447001
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Export Support
                  </h3>
                  <p className="text-slate-300">
                    Available Mon-Fri, 9 AM - 6 PM IST
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    Location
                  </h3>
                  <p className="text-slate-600">
                    Kolhapur, Maharashtra, India
                    <br />
                    Export Hub - Pan India Operations
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/919960447001"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl mt-6"
            >
              <WhatsAppIcon size={24} />
              Chat on WhatsApp
            </a>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-md border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-slate-400"
                  placeholder="+91 9876 543 210"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Product Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                >
                  <option value="towels">Towels</option>
                  <option value="cow-dung">Cow Dung Products</option>
                  <option value="organic">Organic Items</option>
                  <option value="other">Other Enquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none placeholder:text-slate-400"
                  placeholder="Tell us about your bulk order requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isLoading ? 'Submitting...' : 'Submit Enquiry'}
              </button>

              {submitted && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold text-center">
                    Thank you! Your enquiry has been submitted successfully. We'll get back to you soon.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
