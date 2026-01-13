import { useState, useRef, useEffect } from 'react';
import { Mail, Copy, Check, ChevronDown } from 'lucide-react';

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

interface EmailButtonProps {
    variant?: 'default' | 'light' | 'minimal';
    showIcon?: boolean;
    className?: string;
}

export default function EmailButton({ variant = 'default', showIcon = true, className = '' }: EmailButtonProps) {
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

    const baseStyles = {
        default: 'text-slate-300 hover:text-blue-400',
        light: 'text-slate-600 hover:text-blue-600',
        minimal: 'text-blue-600 hover:text-blue-700',
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={() => setShowEmailOptions(!showEmailOptions)}
                className={`flex items-center gap-2 transition-colors ${baseStyles[variant]} ${className}`}
            >
                {showIcon && <Mail size={16} />}
                <span>{COMPANY_EMAIL}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${showEmailOptions ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Email Options Dropdown */}
            {showEmailOptions && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 z-[100] overflow-hidden animate-in fade-in duration-200">
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
    );
}
