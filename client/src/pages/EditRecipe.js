// EditRecipe.js - Page to edit an existing recipe
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  // Ingredients state
  const [ingredients, setIngredients] = useState(['']);

  // Image state
  const [imageBase64, setImageBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState('');

  // Error and success messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch existing recipe data when page loads
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
          { credentials: 'include' }
        );
        const data = await res.json();

        if (!res.ok) {
          setError('Recipe not found.');
          setFetching(false);
          return;
        }

        // Check if logged in user is the author
        const profileRes = await fetch(
          `${process.env.REACT_APP_API_URL}/api/users/profile`,
          { credentials: 'include' }
        );
        const profileData = await profileRes.json();

        if (profileData._id !== data.author?._id) {
          setError('You are not allowed to edit this recipe.');
          setFetching(false);
          return;
        }

        // Fill form with existing recipe data
        setFormData({
          title: data.title || '',
          category: data.category || '',
          subcategory: data.subcategory || '',
          instructions: data.instructions || '',
          cookingTime: data.cookingTime || '',
          difficulty: data.difficulty || '',
          servings: data.servings || ''
        });
        setIngredients(data.ingredients || ['']);

        // Set existing image if there is one
        if (data.image) {
          setImagePreview(data.image);
          setImageBase64(data.image);
        }

        setFetching(false);
      } catch (err) {
        setError('Failed to load recipe.');
        setFetching(false);
      }
    };
    fetchRecipe();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'category') {
      setFormData({ ...formData, category: value, subcategory: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (!file) return;

    // Only allow PNG and JPEG
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setImageError('Only PNG and JPEG images are allowed.');
      return;
    }

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setImageError('Image must be smaller than 2MB.');
      return;
    }

    // Convert image to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImageBase64(null);
    setImagePreview(null);
    setImageError('');
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  // Add ingredient field
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  // Remove ingredient field
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
      const filledIngredients = ingredients.filter(i => i.trim() !== '');

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            title: formData.title,
            category: formData.category,
            subcategory: formData.subcategory || null,
            instructions: formData.instructions,
            ingredients: filledIngredients,
            cookingTime: parseInt(formData.cookingTime),
            difficulty: formData.difficulty,
            servings: parseInt(formData.servings),
            image: imageBase64 || null
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update recipe.');
      } else {
        setSuccess('Recipe updated successfully!');
        setTimeout(() => navigate(`/recipe/${id}`), 1000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  // Show loading while fetching recipe
  if (fetching) return <p>Loading recipe...</p>;

  // Show error if not author
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="add-recipe-page">
      <h1 className="page-title">Edit Recipe</h1>

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

            {/* Subcategory */}
            {formData.category && (
              <div className="form-group">
                <label>Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category === 'baking' && (
                    <>
                      <option value="cakes">Cakes</option>
                      <option value="cookies">Cookies</option>
                      <option value="breads">Breads</option>
                      <option value="pastries">Pastries</option>
                      <option value="desserts">Desserts</option>
                    </>
                  )}
                  {formData.category === 'cooking' && (
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
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label>Recipe Image (PNG or JPEG, max 2MB)</label>
            {!imagePreview ? (
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  className="image-input"
                  id="image-input"
                />
                <label htmlFor="image-input" className="image-upload-label">
                  <span>📷 Click to upload image</span>
                  <span className="image-upload-hint">PNG or JPEG only, max 2MB</span>
                </label>
              </div>
            ) : (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn-danger btn-small"
                >
                  Remove Image
                </button>
              </div>
            )}
            {imageError && <p className="error-message">{imageError}</p>}
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

          {/* Buttons */}
          <div className="edit-recipe-buttons">
            <button
              type="button"
              onClick={() => navigate(`/recipe/${id}`)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditRecipe;