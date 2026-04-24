// AddRecipe.js - Page to create a new recipe
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddRecipe() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    instructions: '',
    cookingTime: '',
    difficulty: '',
    servings: ''
  });

  // Ingredients state - stored as array
  const [ingredients, setIngredients] = useState(['']);

  // Error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData({ ...formData, category: value, subcategory: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle ingredient input changes
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  // Add a new ingredient field
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  // Remove an ingredient field
  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title || formData.title.trim().length < 3) {
      return 'Title must be at least 3 characters.';
    }
    if (!formData.category) {
      return 'Please select a category.';
    }
    const filledIngredients = ingredients.filter(i => i.trim() !== '');
    if (filledIngredients.length === 0) {
      return 'Please add at least one ingredient.';
    }
    if (!formData.instructions || formData.instructions.trim().length < 10) {
      return 'Instructions must be at least 10 characters.';
    }
    if (!formData.cookingTime || formData.cookingTime < 1) {
      return 'Please enter a valid cooking time.';
    }
    if (!formData.difficulty) {
      return 'Please select a difficulty level.';
    }
    if (!formData.servings || formData.servings < 1) {
      return 'Please enter a valid number of servings.';
    }
    return null;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // Filter out empty ingredients
      const filledIngredients = ingredients.filter(i => i.trim() !== '');

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            ingredients: filledIngredients,
            cookingTime: parseInt(formData.cookingTime),
            servings: parseInt(formData.servings)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create recipe.');
      } else {
        setSuccess('Recipe created successfully!');
        // Redirect to recipe detail page
        setTimeout(() => navigate(`/recipe/${data.recipe._id}`), 1000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="add-recipe-page">
      <h1 className="page-title">Add New Recipe</h1>

      <div className="add-recipe-container card">

        {/* Error message */}
        {error && <p className="error-message">{error}</p>}

        {/* Success message */}
        {success && <p className="success-message">{success}</p>}

        <form onSubmit={handleSubmit}>

          {/* Title */}
          <div className="form-group">
            <label>Recipe Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter recipe title"
            />
          </div>

          {/* Category and Subcategory */}
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                <option value="cooking">Cooking</option>
                <option value="baking">Baking</option>
              </select>
            </div>

            {/* Subcategory - only show if baking selected */}
            {formData.category === 'baking' && (
              <div className="form-group">
                <label>Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                >
                  <option value="">Select Subcategory</option>
                  <option value="cakes">Cakes</option>
                  <option value="cookies">Cookies</option>
                  <option value="breads">Breads</option>
                  <option value="pastries">Pastries</option>
                  <option value="desserts">Desserts</option>
                </select>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="form-group">
            <label>Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-row">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder={`Ingredient ${index + 1}`}
                />
                {/* Only show remove button if more than one ingredient */}
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn-danger btn-small"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="btn-secondary btn-small"
            >
              + Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="form-group">
            <label>Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Write your recipe instructions here..."
              rows="6"
            />
          </div>

          {/* Cooking time, difficulty, servings */}
          <div className="form-row">
            <div className="form-group">
              <label>Cooking Time (mins)</label>
              <input
                type="number"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g. 30"
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="e.g. 4"
                min="1"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn-primary submit-btn"
            disabled={loading}
          >
            {loading ? 'Creating Recipe...' : 'Create Recipe'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddRecipe;