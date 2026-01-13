import { useState, useRef, useEffect } from 'react';
import { Mail, Copy, Check, ChevronDown } from 'lucide-react';
import WhatsAppIcon from './icons/WhatsAppIcon';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

export default function CTABlock() {
    const [showEmailOptions, setShowEmailOptions] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
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

    return (
        <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-24">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/hero/bulk.avif')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Text content */}
                <div className="text-white">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight">
                        Looking for <span className="text-blue-400">Bulk Orders</span> or <span className="text-blue-400">Custom Requirements?</span>
                    </h2>
                    <p className="mt-6 text-lg text-slate-300 max-w-xl">
                        Get in touch with our team for personalized quotes and export solutions tailored to your needs. We're here to help you scale your business globally.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-6 bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 shadow-2xl">
                    <a
                        href="https://wa.me/919960447001"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center justify-center gap-4 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/40"
                    >
                        <WhatsAppIcon size={24} className="transition-transform duration-300 group-hover:scale-110" />
                        <span>WhatsApp Enquiry</span>
                    </a>

                    {/* Email Button with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowEmailOptions(!showEmailOptions)}
                            className="group w-full inline-flex items-center justify-center gap-4 px-6 py-4 bg-white/90 text-slate-800 font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-white/30"
                        >
                            <Mail size={24} className="transition-transform duration-300 group-hover:scale-110" />
                            <span>Contact Us via Email</span>
                            <ChevronDown
                                size={18}
                                className={`transition-transform duration-200 ${showEmailOptions ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Email Options Dropdown */}
                        {showEmailOptions && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in duration-200">
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
            </div>
        </section>
    );
}
