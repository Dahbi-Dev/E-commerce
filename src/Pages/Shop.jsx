import React from 'react';
import Hero from '../Components/Hero/Hero';
import NewCollection from '../Components/NewCollection/NewCollection';
import NewsLetter from '../Components/NewsLetter/NewsLetter';
import Offers from '../Components/Offers/Offers';
import Popular from '../Components/Popular/Popular';
import CookieConsent from '../Components/CookieConsent/CookieConsent';


const Shop = () => {
    return (
        <div>
           <Hero />
           <Popular />
           <Offers />
           <NewCollection />
           <NewsLetter />
           <CookieConsent />
        </div>
    );
}

export default Shop;