import React from 'react';
import ministry from './Ministry.png';
import { FaUserTie, FaCreditCard, FaClock } from 'react-icons/fa'; // Icons for the options

const Hero = () => {
  return (
    <section className="hero" style={{ height: '100vh'}}>
      {/* Column 1: Main Content */}
      <div className="hero-content">
        <h1 style={{ fontSize: '6vw' }}>Digital Financing</h1>
        <p className="hero-subtitle">Specialists in tailored personal and business loans.</p>
        
        <div style={{}}>
            <img src={ministry} alt="Ministry regulated company logo" />
            <p>Company regulated by the Ministry of Health and Consumer Affairs - Registration No.: 850/2018</p>
        </div>
      </div>

      {/* Column 2: The "Nicer" Options */}
      <div className="hero-options">
        <ul>
            <li>
                <FaUserTie className="option-icon" />
                <span>Personalized Consulting</span>
            </li>
            <li>
                <FaCreditCard className="option-icon" />
                <span>Comfortable custom installments</span>
            </li>
            <li>
                <FaClock className="option-icon" />
                <span>Response within 24 hours</span>
            </li>
            <li>
                {/* Contact US with center alignment of text and width of 100%  */}
                <span style={{ textAlign: 'center', width: '100%' }}>Contact US</span>
            </li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;