import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner
import './Offers.css';

const Offers = () => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${api}/offers`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await res.json();

        // Set the first offer if available
        if (data.length > 0) {
          setOffer(data[0]); // Get the first offer from the array
        } else {
          console.error('No offers found');
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        // Add a delay of 2 seconds before setting loading to false
        setTimeout(() => {
          setLoading(false); // Update loading state after delay
        }, 2000);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader loading={loading} size={50} color="#ff6b6b" /> {/* Loading Spinner */}
      </div>
    ); // Show loading spinner
  }

  if (!offer) return <div>No offer found.</div>; // Handle case where no offer is found

  // Create gradient using background_color_1 and background_color_2
  const backgroundStyle = {
    background: `linear-gradient(to right, ${offer.background_color_1}, ${offer.background_color_2})`,
  };

  return (
    <div className='offers' style={backgroundStyle}>
      <div className="offers-left">
        <h1>{offer.headline_1}</h1>
        <h1>{offer.headline_2}</h1>
        <p>{offer.paragraph}</p>
        <button style={{ backgroundColor: offer.button_color }}>{offer.button_text}</button>
      </div>

      <div className="offers-right">
        <img src={offer.image_url} alt="Exclusive Offer" />
      </div>
    </div>
  );
};

export default Offers;
