import React, { useState } from 'react';

const CookieBanner = () => {
    const [showBanner, setShowBanner] = useState(true);

    const handleAcceptAll = () => {
        setShowBanner(false);
    };

    const handleRejectAll = () => {
        setShowBanner(false);
    };

    const handleCookieSettings = () => {
        setShowBanner(false);
    };

    if (!showBanner) {
        return null;
    }
    
  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          We agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts. <a href="#">Cookie Policy</a>
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn-settings" onClick={handleCookieSettings}>Cookies Settings</button>
          <button className="cookie-btn" onClick={handleRejectAll}>Reject All</button>
          <button className="cookie-btn" onClick={handleAcceptAll}>Accept All Cookies</button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;