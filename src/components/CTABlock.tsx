import { Mail } from 'lucide-react';

// Official WhatsApp Logo SVG Component
const WhatsAppIcon = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={className}
        fill="currentColor"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function CTABlock() {
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
                    <a
                        href="mailto:amritva009@amritvaoverseas.com"
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
