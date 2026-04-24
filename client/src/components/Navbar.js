// Navbar.js - Navigation bar shown on every page
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  // Track if user is logged in by checking cookie
  const [isLoggedIn, setIsLoggedIn] = useState(
    document.cookie.includes('username')
  );

  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      // Send logout request to backend
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      // Clear logged in state
      setIsLoggedIn(false);
      // Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="navbar-logo">
        🍴 RecipeRank
      </Link>

      {/* Navigation links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/browse">Browse Recipes</Link></li>
        {isLoggedIn && <li><Link to="/add-recipe">Add Recipe</Link></li>}
        {isLoggedIn && <li><Link to="/compare">Compare</Link></li>}
        {isLoggedIn && <li><Link to="/profile">Profile</Link></li>}
      </ul>

      {/* Auth buttons */}
      <div className="navbar-auth">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        ) : (
          <Link to="/login" className="btn-login">
            Login / Register
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;