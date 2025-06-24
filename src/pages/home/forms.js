// src/Forms.js (No changes needed)

import React, { useState } from 'react';

const Forms = () => {
  // Use a single state object to hold all form data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    business: '',
    email: '',
    amount: '',
    deadline: '',
  });

  // A single handler function to update the state for any input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default page reload
    console.log('Form Submitted:', formData);
    alert(`Thank you, ${formData.name}. Your inquiry has been received.`);
    // Optional: Reset form after submission
    setFormData({
      name: '',
      phone: '',
      business: '',
      email: '',
      amount: '',
      deadline: '',
    });
  };

  return (
    <section className="form-section">
      <div className="form-container">
        <h2>Contact Our Team</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="business">Business Name</label>
            <input
              type="text"
              id="business"
              name="business"
              value={formData.business}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Inquiry Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="e.g., 50000"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Project Deadline</label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>
          
          <p className="form-disclaimer">
          Data Controller: Digital Financing 360, SL Purpose: Receive applications for financing management. Legal Basis: Consent of the interested party. Recipients: Data will not be transferred to third parties, except by legal requirement. The data will be stored on SiteGround Spain SL's servers, located within the European Union and in accordance with its privacy policy. Rights: You have the right to access, rectify, and delete your data, rights that you can exercise by sending an email to info@digitalfinancing360.com
          </p>

          <button type="submit" className="form-submit-btn">Send</button>
        </form>
      </div>
    </section>
  );
};

export default Forms;