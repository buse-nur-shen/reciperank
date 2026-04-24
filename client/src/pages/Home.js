// Home.js - Landing page showing featured recipes
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

function Home() {
  // State to store featured recipes
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  // State to store baking recipes
  const [bakingRecipes, setBakingRecipes] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');

  // Fetch recipes when page loads
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // Fetch all recipes for featured section
        const allRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes`,
          { credentials: 'include' }
        );
        const allData = await allRes.json();
        // Show first 3 recipes as featured
        setFeaturedRecipes(allData.slice(0, 3));

        // Fetch baking recipes
        const bakingRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes?category=baking`,
          { credentials: 'include' }
        );
        const bakingData = await bakingRes.json();
        // Show first 3 baking recipes
        setBakingRecipes(bakingData.slice(0, 3));

        setLoading(false);
      } catch (err) {
        setError('Failed to load recipes. Please try again.');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="home-page">

      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to RecipeRank 🍴</h1>
        <p>Discover, share, and compare the best recipes from our community.</p>
        <div className="hero-buttons">
          <Link to="/browse" className="btn-primary">
            Browse Recipes
          </Link>
          <Link to="/login" className="btn-secondary">
            Join Now
          </Link>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Loading message */}
      {loading ? (
        <p>Loading recipes...</p>
      ) : (
        <>
          {/* Featured Recipes Section */}
          <section className="home-section">
            <h2 className="section-title">Featured Recipes</h2>
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

          {/* Popular Baking Recipes Section */}
          <section className="home-section">
            <h2 className="section-title">Popular Baking Recipes</h2>
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