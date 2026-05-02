import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';

function BrowseRecipes() {
  // State to store all recipes
  const [recipes, setRecipes] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');
  // State for search input
  const [searchInput, setSearchInput] = useState('');
  // State for active search term
  const [searchTerm, setSearchTerm] = useState('');
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

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput.toLowerCase());
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput('');
    setSearchTerm('');
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ category: '', subcategory: '', difficulty: '' });
    clearSearch();
  };

  // Filter recipes by search term on the frontend
  const filteredRecipes = recipes.filter(recipe => {
    if (!searchTerm) return true;
    return (
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.category.toLowerCase().includes(searchTerm) ||
      (recipe.subcategory && recipe.subcategory.toLowerCase().includes(searchTerm)) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="browse-page">
      <h1 className="page-title">Browse Recipes</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="search-bar-form">
        <div className="search-bar">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, ingredient, or category..."
            className="search-input"
          />
          <button type="submit" className="btn-primary search-btn">
            Search
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="btn-secondary search-btn"
            >
              Clear
            </button>
          )}
        </div>
        {/* Show active search term */}
        {searchTerm && (
          <p className="search-active">
            Showing results for: <strong>"{searchTerm}"</strong>
          </p>
        )}
      </form>

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

          {/* Subcategory filter */}
          {filters.category && (
            <div className="form-group">
              <label>Subcategory</label>
              <select
                name="subcategory"
                value={filters.subcategory}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {/* Baking subcategories */}
                {filters.category === 'baking' && (
                  <>
                    <option value="cakes">Cakes</option>
                    <option value="cookies">Cookies</option>
                    <option value="breads">Breads</option>
                    <option value="pastries">Pastries</option>
                    <option value="desserts">Desserts</option>
                  </>
                )}
                {/* Cooking subcategories */}
                {filters.category === 'cooking' && (
                  <>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="soups">Soups</option>
                    <option value="salads">Salads</option>
                  </>
                )}
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
            Clear All
          </button>
        </aside>

        {/* Recipes Grid */}
        <main className="recipes-main">

          {/* Error message */}
          {error && <p className="error-message">{error}</p>}

          {/* Loading */}
          {loading ? (
            <p>Loading recipes...</p>
          ) : filteredRecipes.length === 0 ? (
            <p>No recipes found. Try different filters or search terms!</p>
          ) : (
            <>
              <p className="recipes-count">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
              <div className="recipe-grid">
                {filteredRecipes.map(recipe => (
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