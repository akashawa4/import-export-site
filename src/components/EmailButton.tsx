import { useState } from 'react';
import { Mail } from 'lucide-react';
import EmailModal, { COMPANY_EMAIL } from './EmailModal';
import { handleEmailClick } from '../utils/deviceUtils';

interface EmailButtonProps {
    variant?: 'default' | 'light' | 'minimal';
    showIcon?: boolean;
    className?: string;
}

export default function EmailButton({ variant = 'default', showIcon = true, className = '' }: EmailButtonProps) {
    const [showModal, setShowModal] = useState(false);

    const baseStyles = {
        default: 'text-slate-300 hover:text-blue-400',
        light: 'text-slate-600 hover:text-blue-600',
        minimal: 'text-blue-600 hover:text-blue-700',
    };

    const handleClick = () => {
        handleEmailClick(() => setShowModal(true));
    };

    return (
        <>
            <button
                onClick={handleClick}
                className={`flex items-center gap-2 transition-colors ${baseStyles[variant]} ${className}`}
            >
                {showIcon && <Mail size={16} />}
                <span>{COMPANY_EMAIL}</span>
            </button>

            <EmailModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    );
}
