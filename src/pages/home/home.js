// src/Home.js

import React, { useState } from 'react';
import { FiMenu, FiX, FiChevronDown } from 'react-icons/fi'; // Icons for menu
import './home.css'; // The CSS for responsiveness is crucial

import Hero from './Hero';
import CookieBanner from './CookieBanner';
import logo from './logo.png';
import Forms from './forms';
import Footer from './Footer';

const Home = () => {
  // State to manage whether the mobile menu is visible
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // This div helps manage body scrolling when the mobile menu is open
    <div className={isMenuOpen ? 'body-no-scroll' : ''}>
      <header className="header" style={{ maxWidth: '100%', width:'100%'}}>
        <div className="header-container">
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>

          {/* Hamburger menu button - visible only on mobile via CSS */}
          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu" style={{position:'absolute', right:'20px', top:'20px'}}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          {/* Navigation wrapper that becomes the mobile slide-out menu */}
          <div className={isMenuOpen ? 'nav-wrapper open' : 'nav-wrapper'}>
            <nav className="main-nav">
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Services <FiChevronDown /></a></li>
                <li><a href="#">Blog <FiChevronDown /></a></li>
                <li><a href="#">Contact <FiChevronDown /></a></li>
                <li><a href="#">Legal Notice <FiChevronDown /></a></li>
              </ul>
            </nav>

            <nav className="secondary-nav">
              <ul>
                <li><a href="/client_login">Client Portal</a></li>
                <li className="nav-divider">|</li>
                <li><a href="#">Investor Portal</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Use <main> tag for the main content of the page */}
      <main>
        <Hero/>
        <Forms />
      </main>
      
      <CookieBanner />
      <Footer />
    </div>
  );
};

export default Home;