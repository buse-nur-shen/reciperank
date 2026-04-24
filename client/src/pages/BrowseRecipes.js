// BrowseRecipes.js - Page to browse and filter all recipes
import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

function BrowseRecipes() {
  // State to store all recipes
  const [recipes, setRecipes] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');
  // State for filters
  const [filters, setFilters] = useState({
    category: '',
    subcategory: '',
    difficulty: ''
  });

  // Fetch recipes when filters change
  useEffect(() => {
    fetchRecipes();
  }, [filters]);

  // Fetch recipes from backend with filters
  const fetchRecipes = async () => {
    setLoading(true);
    try {
      // Build query string from filters
      const query = new URLSearchParams();
      if (filters.category) query.append('category', filters.category);
      if (filters.subcategory) query.append('subcategory', filters.subcategory);
      if (filters.difficulty) query.append('difficulty', filters.difficulty);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes?${query.toString()}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setRecipes(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Reset subcategory when category changes
    if (name === 'category') {
      setFilters({ ...filters, category: value, subcategory: '' });
    } else {
      setFilters({ ...filters, [name]: value });
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', difficulty: '' });
  };

  return (
    <div className="browse-page">
      <h1 className="page-title">Browse Recipes</h1>

      <div className="browse-layout">

        {/* Filters Sidebar */}
        <aside className="filters-sidebar card">
          <h3 className="filters-title">Filters</h3>

          {/* Category filter */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="cooking">Cooking</option>
              <option value="baking">Baking</option>
            </select>
          </div>

          {/* Subcategory filter - only show if baking selected */}
          {filters.category === 'baking' && (
            <div className="form-group">
              <label>Baking Section</label>
              <select
                name="subcategory"
                value={filters.subcategory}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option value="cakes">Cakes</option>
                <option value="cookies">Cookies</option>
                <option value="breads">Breads</option>
                <option value="pastries">Pastries</option>
                <option value="desserts">Desserts</option>
              </select>
            </div>
          )}

          {/* Difficulty filter */}
          <div className="form-group">
            <label>Difficulty</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Clear filters button */}
          <button onClick={clearFilters} className="btn-secondary">
            Clear Filters
          </button>
        </aside>

        {/* Recipes Grid */}
        <main className="recipes-main">

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Loading */}
          {loading ? (
            <p>Loading recipes...</p>
          ) : recipes.length === 0 ? (
            <p>No recipes found. Try different filters!</p>
          ) : (
            <>
              <p className="recipes-count">
                {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} found
              </p>
              <div className="recipe-grid">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default BrowseRecipes;