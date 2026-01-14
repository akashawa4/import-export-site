import { useState } from 'react';
import { Mail } from 'lucide-react';
import WhatsAppIcon from './icons/WhatsAppIcon';
import EmailModal from './EmailModal';
import { handleEmailClick } from '../utils/deviceUtils';

export default function CTABlock() {
    const [showEmailModal, setShowEmailModal] = useState(false);

    return (
        <>
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

                        <button
                            onClick={() => handleEmailClick(() => setShowEmailModal(true))}
                            className="group inline-flex items-center justify-center gap-4 px-6 py-4 bg-white/90 text-slate-800 font-bold rounded-xl hover:bg-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-white/30"
                        >
                            <Mail size={24} className="transition-transform duration-300 group-hover:scale-110" />
                            <span>Contact Us via Email</span>
                        </button>
                    </div>
                </div>
            </section>

            <EmailModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} />
        </>
    );
}
