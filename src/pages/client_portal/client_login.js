import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import './client_login.css';
import loginBgImage from './madrid.jpg';

// Import Firebase auth functions
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

// Import useNavigate from react-router-dom
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate(); // Initialize navigate hook

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      if (isRegistering) {
        // Register new user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Successfully created user:', user);
        alert('Account created successfully! Please log in with your new account.');
        // After creation, go back to login view and clear form
        setIsRegistering(false);
        setEmail('');
        setPassword('');
      } else {
        // Sign in existing user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Successfully logged in user:', user);
        alert('Login successful!');
        // Redirect to client portal
        navigate('/client_portal');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      let errorMessage = "An unknown error occurred.";

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = "Invalid email or password. Please try again.";
          break;
        case 'auth/invalid-email':
          errorMessage = "The email address is not valid.";
          break;
        case 'auth/email-already-in-use':
          errorMessage = "This email is already registered. Please log in or use a different email.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak. Please choose a stronger password (min 6 characters).";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="login-page">
      {/* Left Column: The Form */}
      <div className="login-form-container">
        <div className="back-btn" onClick={() => window.history.back()} style={{ position: 'absolute', top: '1rem', left: '1rem'}}>
          <p>
            <FiArrowLeft /> Back
          </p>
        </div>
        <div className="form-wrapper">
          <div className="login-header">
            <p className="logo-text">Digital Financing 360 <span></span></p>
            <h1>{isRegistering ? 'Create Account' : 'Welcome Client'}</h1>
            <p className="subtitle">
              {isRegistering ? 'Join us to get started.' : 'Log in to your account to continue.'}
            </p>
          </div>

          <form onSubmit={handleAuthAction} className="login-form">
            {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <div className="input-group">
              <label htmlFor="email">EMAIL ADDRESS</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="password-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="login-btn">
              {isRegistering ? 'CREATE ACCOUNT' : 'LOG IN'}
            </button>
          </form>

          <div className="login-footer">
            {!isRegistering ? (
              <>
                <a href="#">FORGOT YOUR PASSWORD</a>
                <a href="#">CHANGE YOUR PASSWORD</a>
                <p>
                  Don't have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(true); setError(null); setEmail(''); setPassword(''); }}>Sign Up</a>
                </p>
              </>
            ) : (
              <p>
                Already have an account?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(false); setError(null); setEmail(''); setPassword(''); }}>Log In</a>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: The Image */}
      <div
        className="login-image-container"
        style={{ backgroundImage: `url(${loginBgImage})` }}
      >
        {/* The background image is applied via CSS */}
      </div>
    </div>
  );
};

export default LoginPage;