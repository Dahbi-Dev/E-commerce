import React, { useState, useEffect } from 'react';
import './CookieConsent.css'

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${api}/api/user/me`, {
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();

    const thirdPartyCookieConsent = localStorage.getItem('thirdPartyCookieConsent');
    if (!thirdPartyCookieConsent && !isLoggedIn) {
      setIsVisible(true);
    }
  }, [isLoggedIn]);

  const handleAccept = () => {
    localStorage.setItem('thirdPartyCookieConsent', 'true');
    setIsVisible(false);
    // Here you would typically set your third-party cookies
  };

  const handleDecline = () => {
    localStorage.setItem('thirdPartyCookieConsent', 'false');
    setIsVisible(false);
    // Here you would typically block or remove third-party cookies
  };

  if (!isVisible || isLoggedIn) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-container">
        <p className="cookie-consent-text">
          We use third-party cookies to enhance your browsing experience and analyze our traffic. 
          By clicking "Accept", you consent to our use of third-party cookies.
        </p>
        <div className="cookie-consent-buttons">
          <button onClick={handleAccept} className="cookie-consent-accept">
            Accept
          </button>
          <button onClick={handleDecline} className="cookie-consent-decline">
            Decline
          </button>
          <button onClick={() => setIsVisible(false)} className="cookie-consent-close">
            ×
          </button>
        </div>
      </div>
      <style jsx>{`
        /* CSS styles remain the same as in the previous version */
      `}</style>
    </div>
  );
};

export default CookieConsent;