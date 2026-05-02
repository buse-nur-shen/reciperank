import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // useLocation detects every page change
  const location = useLocation();

  // Check login status every time the page changes
  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  // Check if user is logged in by calling profile endpoint
  const checkLoginStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { credentials: 'include' }
      );
      if (res.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
         RecipeRank
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