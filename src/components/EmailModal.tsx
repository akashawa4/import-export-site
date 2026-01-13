import { useState } from 'react';
import { Copy, Check, X, Mail } from 'lucide-react';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Official brand SVG logos
const GmailLogo = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" className="flex-shrink-0">
        <path fill="#4285F4" d="M22.288 21.423H1.713V8.34l10.287 7.5 10.288-7.5z" />
        <path fill="#34A853" d="M22.288 21.423L12 13.84V2.577h10.288z" />
        <path fill="#FBBC05" d="M1.713 21.423L12 13.84V2.577H1.713z" />
        <path fill="#EA4335" d="M12 13.84l10.288-7.5V2.577L12 10.077 1.713 2.577V6.34z" />
    </svg>
);

const OutlookLogo = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" className="flex-shrink-0">
        <path fill="#0078D4" d="M24 7.387v10.478c0 .23-.08.424-.238.583a.793.793 0 0 1-.583.238h-8.333v-8.45l1.575 1.134a.395.395 0 0 0 .479-.005l6.862-5.235c.09-.067.168-.09.238-.067z" />
        <path fill="#0078D4" d="M24 5.687l-.024.09c-.023.067-.08.14-.17.22l-7.56 5.776a.395.395 0 0 1-.479.005l-1.575-1.134V5.24a.783.783 0 0 1 .24-.575.783.783 0 0 1 .574-.24h8.173c.134 0 .253.028.358.085.105.057.195.128.268.214a.57.57 0 0 1 .195.433z" />
        <path fill="#0A2767" d="m9.326 8.046-.048.092H4.61l-.048-.092 2.383-1.538z" />
        <path fill="#28A8EA" d="M9.326 8.046v7.523c0 .203-.072.376-.215.52a.71.71 0 0 1-.521.215H.736a.71.71 0 0 1-.521-.215.709.709 0 0 1-.215-.52v-7.523l.048-.092 4.668 2.86c.144.092.302.138.474.138s.33-.046.474-.138l4.668-2.86z" />
        <path fill="#0078D4" d="M14.192 5.24v12.074a.783.783 0 0 1-.24.575.783.783 0 0 1-.574.24H0v-9.28L4.562 11c.144.092.302.138.474.138s.33-.046.474-.138l4.454-2.726a.804.804 0 0 1 .362-.133v-2.38c0-.224.08-.415.24-.575a.783.783 0 0 1 .574-.24H14.192z" />
        <path opacity=".5" fill="#0A2767" d="M9.69 15.124v.52a.283.283 0 0 1-.048.155.27.27 0 0 1-.13.101l-4.285 1.958a.816.816 0 0 1-.417.11.866.866 0 0 1-.442-.125L.048 15.57A.27.27 0 0 1 0 15.4v-.52a.283.283 0 0 1 .048-.155.27.27 0 0 1 .13-.101l4.285-1.958a.816.816 0 0 1 .417-.11c.156 0 .303.042.442.125l4.32 2.273a.27.27 0 0 1 .048.17z" />
    </svg>
);

const YahooLogo = () => (
    <svg viewBox="0 0 24 24" width="28" height="28" className="flex-shrink-0">
        <path fill="#6001D2" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 7.63l-2.888 6.752h-.017l-2.871-6.751h-2.21l4.137 9.193-.048.114c-.293.683-.545 1.033-1.076 1.033-.327 0-.686-.08-.996-.228l-.376 1.575c.458.164.928.247 1.4.247 1.467 0 2.177-.773 2.888-2.504L20 7.63h-2.106zM7.164 7.63H4v1.668h1.5c.915 0 1.5.604 1.5 1.668v1.003c0 1.064-.585 1.668-1.5 1.668H4v1.668h3.164c1.926 0 3.336-1.276 3.336-3.336v-1.003c0-2.06-1.41-3.336-3.336-3.336z" />
    </svg>
);

const DefaultMailLogo = () => (
    <div className="w-7 h-7 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Mail size={16} className="text-white" />
    </div>
);

export default function EmailModal({ isOpen, onClose }: EmailModalProps) {
    const [emailCopied, setEmailCopied] = useState(false);

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
            Logo: GmailLogo,
            url: `https://mail.google.com/mail/?view=cm&fs=1&to=${COMPANY_EMAIL}&su=Enquiry%20from%20Amritva%20Overseas`,
            bgHover: 'hover:bg-red-50'
        },
        {
            name: 'Outlook',
            Logo: OutlookLogo,
            url: `https://outlook.live.com/mail/0/deeplink/compose?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Amritva%20Overseas`,
            bgHover: 'hover:bg-blue-50'
        },
        {
            name: 'Yahoo Mail',
            Logo: YahooLogo,
            url: `https://compose.mail.yahoo.com/?to=${COMPANY_EMAIL}&subject=Enquiry%20from%20Amritva%20Overseas`,
            bgHover: 'hover:bg-purple-50'
        },
        {
            name: 'Default Mail App',
            Logo: DefaultMailLogo,
            url: `mailto:${COMPANY_EMAIL}?subject=Enquiry%20from%20Amritva%20Overseas`,
            bgHover: 'hover:bg-slate-50'
        },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-sm bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
                {/* Header with Logo */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 bg-slate-800">
                    <div className="flex items-center gap-3">
                        <img src="/companylogo.avif" alt="Amritva Overseas" className="h-10 w-auto" />
                        <div>
                            <h3 className="text-lg font-bold text-white">Send Email</h3>
                            <p className="text-xs text-slate-400">{COMPANY_EMAIL}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-700 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Options */}
                <div className="p-4 bg-white">
                    <p className="text-xs text-slate-500 font-semibold uppercase mb-3 px-1">Choose an option</p>
                    <div className="space-y-1">
                        {emailOptions.map((option) => {
                            const Logo = option.Logo;
                            return (
                                <a
                                    key={option.name}
                                    href={option.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={onClose}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${option.bgHover}`}
                                >
                                    <Logo />
                                    <span className="font-medium text-slate-700">{option.name}</span>
                                </a>
                            );
                        })}
                    </div>

                    <div className="border-t border-slate-200 my-3" />

                    <button
                        onClick={handleCopyEmail}
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-colors hover:bg-green-50 w-full"
                    >
                        {emailCopied ? (
                            <>
                                <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Check size={16} className="text-white" />
                                </div>
                                <span className="font-medium text-green-600">Copied to Clipboard!</span>
                            </>
                        ) : (
                            <>
                                <div className="w-7 h-7 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Copy size={16} className="text-slate-600" />
                                </div>
                                <span className="font-medium text-slate-700">Copy Email Address</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Export the email constant for reuse
export { COMPANY_EMAIL };
