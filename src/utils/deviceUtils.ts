// Helper function to detect mobile devices
export const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
};

// Company email constant for reuse
export const COMPANY_EMAIL = 'amritva009@amritvaoverseas.com';

// Helper function to open email - directly on mobile, returns false to show modal on desktop
export const handleEmailClick = (showModalCallback: () => void): void => {
    if (isMobileDevice()) {
        // On mobile, directly open the mail app
        window.location.href = `mailto:${COMPANY_EMAIL}?subject=Enquiry%20from%20Amritva%20Overseas`;
    } else {
        // On desktop, show the modal with options
        showModalCallback();
    }
};
