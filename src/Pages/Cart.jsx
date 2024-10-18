import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader'; // Import the spinner
import CartItems from '../Components/CartItems/CartItems';

function Cart() {
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 1.2 seconds
    }, 1200);

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ClipLoader loading={loading} size={50} color="#ff6b6b" /> {/* Loading Spinner */}
      </div>
    ); // Show loading spinner
  }

  return (
    <div>
      <CartItems /> {/* Render CartItems after loading */}
    </div>
  );
}

export default Cart;
