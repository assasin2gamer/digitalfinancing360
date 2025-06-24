

import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import logo from "./logo.png";
import Ministry from "./Ministry.png";

const Footer = () => {
    const footerLinks = [
      "Start",
      "Personal loans",
      "Business credits",
      "FAQs",
      "Blog",
      "Legal Notice",
      "Privacy Policy",
    ];
  
    return (
      <footer className="footer-wrapper">
        <div className="footer-main">
          <div className="footer-content">
            {/* Column 1: About Us */}
            <div className="footer-col">
              <h3>ABOUT US</h3>
              <p>
                At Digital Financing 360, we specialize in assessing our clients' financing needs and structuring customized solutions.
              </p>
            </div>
  
            {/* Column 2: Company Info */}
            <div className="footer-col">
              <img 
                src={Ministry} 
                alt="Gobierno de España Logo" 
                className="spain-gov-logo"
              />
              <p className="regulated-text">
                Company regulated by the Ministry of Health and Consumer Affairs
                <br />
                - Registration No.: 850/2018
              </p>
              <div className="contact-info">
                <FaEnvelope />
                <span>info@digitalfinancing360.com</span>
              </div>
              <div className="contact-info">
                <FaPhoneAlt />
                <span>910 053 107</span>
              </div>
            </div>
  
            {/* Column 3: Links */}
            <div className="footer-col">
              <ul className="footer-links">
                {footerLinks.map(link => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Column 4: Logo */}
            <div className="footer-col">
                <img src={logo} alt="Logo" />
            </div>
          </div>
        </div>
  
        <div className="footer-sub">
          <p>© Copyright 2018. DIGITAL FINANCING 360, SL All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;