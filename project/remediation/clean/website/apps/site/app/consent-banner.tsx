'use client';

import { useEffect, useState } from "react";

export default function ConsentBanner() {
  const [consentState, setConsentState] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check consent on mount
    const consent = localStorage.getItem('consent');
    setConsentState(consent);
    
    // Show banner if no consent decision yet
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('consent', 'granted');
    setConsentState('granted');
    setIsVisible(false);
    
    // Reload to initialize analytics
    window.location.reload();
  };

  const handleDecline = () => {
    localStorage.setItem('consent', 'denied');
    setConsentState('denied');
    setIsVisible(false);
  };

  if (!isVisible || consentState) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="mx-auto max-w-4xl ff-card shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h3 className="font-semibold mb-2">🍪 Cookie Consent</h3>
            <p className="text-sm text-neutral-400">
              We use analytics cookies to improve our site and understand how visitors interact with FlashFusion. 
              Your data is anonymized and never sold.
            </p>
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 rounded-lg border border-neutral-600 hover:border-neutral-500 transition-colors text-sm font-medium"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors text-sm font-medium text-white"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
