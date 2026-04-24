// LoginRegister.js - Login and Register page with two tabs
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginRegister() {
  // Track which tab is active - login or register
  const [activeTab, setActiveTab] = useState('login');

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Handle login form input changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle register form input changes
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  // Validate login form
  const validateLogin = () => {
    if (!loginData.email || !loginData.email.includes('@')) {
      return 'Please enter a valid email.';
    }
    if (!loginData.password || loginData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return null;
  };

  // Validate register form
  const validateRegister = () => {
    if (!registerData.username || registerData.username.length < 3) {
      return 'Username must be at least 3 characters.';
    }
    if (!registerData.email || !registerData.email.includes('@')) {
      return 'Please enter a valid email.';
    }
    if (!registerData.password || registerData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    if (registerData.password !== registerData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client side validation
    const validationError = validateLogin();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Send login request to backend
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: loginData.email,
            password: loginData.password
          })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed.');
      } else {
        setSuccess('Logged in successfully!');
        // Redirect to home after login
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  // Handle register submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client side validation
    const validationError = validateRegister();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Send register request to backend
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: registerData.username,
            email: registerData.email,
            password: registerData.password
          })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
      } else {
        setSuccess('Account created! Redirecting...');
        // Redirect to home after register
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container card">

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
          >
            Register
          </button>
        </div>

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Success message */}
        {success && <p className="success-message">{success}</p>}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit}>
            <h2 className="auth-title">Welcome Back!</h2>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="auth-switch">
              Don't have an account?{' '}
              <span onClick={() => setActiveTab('register')}>
                Register here
              </span>
            </p>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit}>
            <h2 className="auth-title">Create Account</h2>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="Choose a password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary auth-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>

            <p className="auth-switch">
              Already have an account?{' '}
              <span onClick={() => setActiveTab('login')}>
                Login here
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginRegister;