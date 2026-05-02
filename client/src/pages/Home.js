import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

function Home() {
  // State to store featured recipes 
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  // State to store most recent baking recipes
  const [bakingRecipes, setBakingRecipes] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');
  // State for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch recipes and check login status when page loads
  useEffect(() => {
    checkLoginStatus();
    fetchRecipes();
  }, []);

  // Check if user is logged in
  const checkLoginStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { credentials: 'include' }
      );
      setIsLoggedIn(res.ok);
    } catch (err) {
      setIsLoggedIn(false);
    }
  };

  // Fetch featured and baking recipes
  const fetchRecipes = async () => {
    try {
      // Fetch featured recipes
      const featuredRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/featured`,
        { credentials: 'include' }
      );
      const featuredData = await featuredRes.json();
      setFeaturedRecipes(featuredData);

      // Fetch most recent baking recipes
      const bakingRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/recent-baking`,
        { credentials: 'include' }
      );
      const bakingData = await bakingRes.json();
      setBakingRecipes(bakingData);

      setLoading(false);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="home-page">

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to RecipeRank </h1>
        <p>Discover, share, and compare the best recipes from our community.</p>
        <div className="hero-buttons">
          <Link to="/browse" className="btn-primary">
            Browse Recipes
          </Link>
          {/* Only show Join Now if not logged in */}
          {!isLoggedIn && (
            <Link to="/login" className="btn-secondary">
              Join Now
            </Link>
          )}
          {/* Show Add Recipe if logged in */}
          {isLoggedIn && (
            <Link to="/add-recipe" className="btn-secondary">
              Add Recipe
            </Link>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading message */}
      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <>
          {/* Featured Recipes */}
          <section className="home-section">
            <h2 className="section-title"> Featured Recipes</h2>
            <p className="section-subtitle">
              Most popular recipes from our community
            </p>
            {featuredRecipes.length === 0 ? (
              <p>No recipes yet. Be the first to add one!</p>
            ) : (
              <div className="recipe-grid">
                {featuredRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>

          {/* Latest Baking Recipes Section */}
          <section className="home-section">
            <h2 className="section-title"> Latest Baking Recipes</h2>
            <p className="section-subtitle">
              Freshly added baking recipes
            </p>
            {bakingRecipes.length === 0 ? (
              <p>No baking recipes yet!</p>
            ) : (
              <div className="recipe-grid">
                {bakingRecipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default Home;