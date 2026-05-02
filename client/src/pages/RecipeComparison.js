
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function RecipeComparison() {
  // Get URL search params 
  const [searchParams] = useSearchParams();

  // State for all recipes 
  const [allRecipes, setAllRecipes] = useState([]);
  // State for selected recipe IDs
  const [recipeAId, setRecipeAId] = useState(searchParams.get('recipeA') || '');
  const [recipeBId, setRecipeBId] = useState('');
  // State for selected recipe data
  const [recipeA, setRecipeA] = useState(null);
  const [recipeB, setRecipeB] = useState(null);
  // State for error
  const [error, setError] = useState('');

  // Fetch all recipes for dropdown on page load
  useEffect(() => {
    const fetchAllRecipes = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setAllRecipes(data);
      } catch (err) {
        setError('Failed to load recipes.');
      }
    };
    fetchAllRecipes();
  }, []);

  // Fetch recipe A when selected or pre-selected from URL
  useEffect(() => {
    if (!recipeAId) {
      setRecipeA(null);
      return;
    }
    const fetchRecipeA = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes/${recipeAId}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setRecipeA(data);
      } catch (err) {
        setError('Failed to load recipe A.');
      }
    };
    fetchRecipeA();
  }, [recipeAId]);

  // Fetch recipe B when selected
  useEffect(() => {
    if (!recipeBId) {
      setRecipeB(null);
      return;
    }
    const fetchRecipeB = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes/${recipeBId}`,
          { credentials: 'include' }
        );
        const data = await res.json();
        setRecipeB(data);
      } catch (err) {
        setError('Failed to load recipe B.');
      }
    };
    fetchRecipeB();
  }, [recipeBId]);

  // Determine which recipe is recommended based on cooking time
  const getRecommended = () => {
    if (!recipeA || !recipeB) return null;
    if (recipeA.cookingTime < recipeB.cookingTime) return recipeA.title;
    if (recipeB.cookingTime < recipeA.cookingTime) return recipeB.title;
    return 'Both recipes are equal!';
  };

  return (
    <div className="comparison-page">
      <h1 className="page-title">Compare Recipes</h1>

      {/* Error message */}
      {error && <p className="error-message">{error}</p>}

      {/* Recipe Selection */}
      <div className="comparison-selectors card">

        {/* Recipe A  */}
        <div className="form-group">
          <label>Recipe A</label>
          <select
            value={recipeAId}
            onChange={(e) => setRecipeAId(e.target.value)}
          >
            <option value="">Select Recipe A</option>
            {allRecipes.map(recipe => (
              <option key={recipe._id} value={recipe._id}>
                {recipe.title}
              </option>
            ))}
          </select>
        </div>

        <div className="comparison-vs">VS</div>

        {/* Recipe B */}
        <div className="form-group">
          <label>Recipe B</label>
          <select
            value={recipeBId}
            onChange={(e) => setRecipeBId(e.target.value)}
          >
            <option value="">Select Recipe B</option>
            {allRecipes
              // Filter out recipe A from recipe B options
              .filter(recipe => recipe._id !== recipeAId)
              .map(recipe => (
                <option key={recipe._id} value={recipe._id}>
                  {recipe.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Comparison Table */}
      {recipeA && recipeB && (
        <div className="comparison-results">

          {/* Side by side comparison */}
          <div className="comparison-grid">

            {/* Recipe A */}
            <div className="comparison-card card">

              {/* Recipe A image */}
              {recipeA.image ? (
                <img
                  src={recipeA.image}
                  alt={recipeA.title}
                  className="comparison-image"
                />
              ) : (
                <div className="comparison-no-image">NA</div>
              )}

              <h2 className="comparison-recipe-title">{recipeA.title}</h2>

              <div className="comparison-stat">
                <span className="comparison-label">Category</span>
                <span className="comparison-value">{recipeA.category}</span>
              </div>

              <div className="comparison-stat">
                <span className="comparison-label">Difficulty</span>
                <span className={`badge badge-difficulty badge-${recipeA.difficulty}`}>
                  {recipeA.difficulty}
                </span>
              </div>

              <div className={`comparison-stat ${recipeA.cookingTime < recipeB.cookingTime ? 'comparison-winner' : ''}`}>
                <span className="comparison-label"> Cook Time</span>
                <span className="comparison-value">{recipeA.cookingTime} mins</span>
                {recipeA.cookingTime < recipeB.cookingTime && (
                  <span className="winner-badge">✓ Faster</span>
                )}
              </div>

              <div className="comparison-stat">
                <span className="comparison-label"> Servings</span>
                <span className="comparison-value">{recipeA.servings}</span>
              </div>

              <div className="comparison-stat">
                <span className="comparison-label">Ingredients</span>
                <span className="comparison-value">
                  {recipeA.ingredients.length} items
                </span>
              </div>

              <div className="comparison-ingredients">
                <span className="comparison-label">Ingredient List</span>
                <ul>
                  {recipeA.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recipe B */}
            <div className="comparison-card card">

              {/* Recipe B image */}
              {recipeB.image ? (
                <img
                  src={recipeB.image}
                  alt={recipeB.title}
                  className="comparison-image"
                />
              ) : (
                <div className="comparison-no-image">NA</div>
              )}

              <h2 className="comparison-recipe-title">{recipeB.title}</h2>

              <div className="comparison-stat">
                <span className="comparison-label">Category</span>
                <span className="comparison-value">{recipeB.category}</span>
              </div>

              <div className="comparison-stat">
                <span className="comparison-label">Difficulty</span>
                <span className={`badge badge-difficulty badge-${recipeB.difficulty}`}>
                  {recipeB.difficulty}
                </span>
              </div>

              <div className={`comparison-stat ${recipeB.cookingTime < recipeA.cookingTime ? 'comparison-winner' : ''}`}>
                <span className="comparison-label"> Cook Time</span>
                <span className="comparison-value">{recipeB.cookingTime} mins</span>
                {recipeB.cookingTime < recipeA.cookingTime && (
                  <span className="winner-badge">✓ Faster</span>
                )}
              </div>

              <div className="comparison-stat">
                <span className="comparison-label"> Servings</span>
                <span className="comparison-value">{recipeB.servings}</span>
              </div>

              <div className="comparison-stat">
                <span className="comparison-label">Ingredients</span>
                <span className="comparison-value">
                  {recipeB.ingredients.length} items
                </span>
              </div>

              <div className="comparison-ingredients">
                <span className="comparison-label">Ingredient List</span>
                <ul>
                  {recipeB.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommended Recipe */}
          <div className="recommendation-box card">
            <h3> Recommended Recipe!</h3>
            <p>{getRecommended()}</p>
          </div>
        </div>
      )}

      {/* Show message if only one recipe selected */}
      {recipeA && !recipeB && (
        <p className="comparison-hint">
          Please select a second recipe to compare!
        </p>
      )}

      {/* Show message if no recipes selected */}
      {!recipeA && !recipeB && (
        <p className="comparison-hint">
          Please select two recipes to compare!
        </p>
      )}
    </div>
  );
}

export default RecipeComparison;