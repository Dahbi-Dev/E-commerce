import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader"; // Import the spinner
import "./Hero.css";

const Hero = () => {
  const [heroData, setHeroData] = useState(null); // State to hold hero data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const api = process.env.REACT_APP_API_URL


  useEffect(() => {
    // Function to fetch hero data from the server
    const fetchHeroData = async () => {
      try {
        const response = await fetch(`${api}/hero`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHeroData(data); // Set the hero data to state

        // Add a delay of 2 seconds
        setTimeout(() => {
          setLoading(false); // Set loading to false after the delay
        }, 1200);
      } catch (error) {
        console.error("Error fetching hero data:", error);
        setLoading(false); // Ensure loading is false even on error
      }
    };

    fetchHeroData();
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <ClipLoader loading={loading} size={50} color="#ff6b6b" /> {/* Loading Spinner */}
      </div>
    ); // Show loading spinner
  }

  if (!heroData) {
    return <div>No hero data available</div>; // Handle case where no data is available
  }

  return (
    <div className="hero" style={{ backgroundColor: heroData.background_color }}>
      <div className="hero-left">
        <h2>{heroData.big_title}</h2>
        <div>
          <div className="hero-hand-icon">
            <p>{heroData.small_title}</p>
            <img src={heroData.icon_image_1 || '../Assets/hand_icon.png'} alt="hand icon" /> {/* Use fetched icon or fallback */}
          </div>
          <p>collections</p>
          <p>for everyone</p>
        </div>
        <a href="#collection" className="hero-latest-btn" style={{ backgroundColor: heroData.button_color }}>
          <div>{heroData.button_text}</div>
          <img src={heroData.icon_image_2 || '../Assets/arrow.png'} alt="arrow icon" /> {/* Use fetched icon or fallback */}
        </a>
      </div>
      <div className="hero-right">
        <img src={heroData.image_collection || heroData.image_url} alt="hero" /> {/* Use image collection or fallback */}
      </div>
    </div>
  );
};

export default Hero;
