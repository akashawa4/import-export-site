import { useState } from 'react';
import { Mail } from 'lucide-react';
import EmailModal from './EmailModal';

interface EmailButtonProps {
    variant?: 'default' | 'light' | 'minimal';
    showIcon?: boolean;
    className?: string;
}

const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

export default function EmailButton({ variant = 'default', showIcon = true, className = '' }: EmailButtonProps) {
    const [showModal, setShowModal] = useState(false);

    const baseStyles = {
        default: 'text-slate-300 hover:text-blue-400',
        light: 'text-slate-600 hover:text-blue-600',
        minimal: 'text-blue-600 hover:text-blue-700',
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`flex items-center gap-2 transition-colors ${baseStyles[variant]} ${className}`}
            >
                {showIcon && <Mail size={16} />}
                <span>{COMPANY_EMAIL}</span>
            </button>

            <EmailModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
