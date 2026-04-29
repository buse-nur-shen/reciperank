// RecipeDetail.js - Page to view a single recipe with reviews
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function RecipeDetail() {
  // Get recipe ID from URL
  const { id } = useParams();
  const navigate = useNavigate();

  // State for recipe data
  const [recipe, setRecipe] = useState(null);
  // State for reviews
  const [reviews, setReviews] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');
  // State for review form
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  // State for review error
  const [reviewError, setReviewError] = useState('');
  // State for review success
  const [reviewSuccess, setReviewSuccess] = useState('');
  // State for logged in status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State for logged in user ID
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  // Fetch recipe and reviews when page loads
  useEffect(() => {
    checkLoginStatus();
    fetchRecipe();
    fetchReviews();
  }, [id]);

  // Check if user is logged in and get their ID
  const checkLoginStatus = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { credentials: 'include' }
      );
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setLoggedInUserId(data._id);
      } else {
        setIsLoggedIn(false);
        setLoggedInUserId(null);
      }
    } catch (err) {
      setIsLoggedIn(false);
      setLoggedInUserId(null);
    }
  };

  // Fetch recipe from backend
  const fetchRecipe = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      if (!res.ok) {
        setError('Recipe not found.');
      } else {
        setRecipe(data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load recipe.');
      setLoading(false);
    }
  };

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews/${id}`,
        { credentials: 'include' }
      );
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  // Handle review form changes
  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  // Handle review submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    // Client side validation
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewError('Rating must be between 1 and 5.');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/reviews/${id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            rating: parseInt(reviewForm.rating),
            comment: reviewForm.comment
          })
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.error || 'Failed to add review.');
      } else {
        setReviewSuccess('Review added!');
        setReviewForm({ rating: 5, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      setReviewError('Something went wrong. Please try again.');
    }
  };

  // Handle delete recipe
  const handleDeleteRecipe = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (res.ok) {
        navigate('/browse');
      } else {
        setError('Failed to delete recipe.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  // Show loading
  if (loading) return <p>Loading recipe...</p>;

  // Show error
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="recipe-detail-page">

      {/* Recipe Header */}
      <div className="recipe-detail-header card">

        {/* Recipe Image */}
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="recipe-detail-image"
          />
        ) : (
          <div className="recipe-detail-no-image">🍴</div>
        )}

        {/* Title and badges */}
        <h1 className="recipe-detail-title">{recipe.title}</h1>

        <div className="recipe-detail-badges">
          <span className="badge badge-category">{recipe.category}</span>
          {recipe.subcategory && (
            <span className="badge badge-subcategory">{recipe.subcategory}</span>
          )}
          <span className={`badge badge-difficulty badge-${recipe.difficulty}`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Recipe stats */}
        <div className="recipe-detail-stats">
          <div className="stat">
            <span className="stat-icon">⏱</span>
            <span className="stat-label">Cook Time</span>
            <span className="stat-value">{recipe.cookingTime} mins</span>
          </div>
          <div className="stat">
            <span className="stat-icon">🍽</span>
            <span className="stat-label">Servings</span>
            <span className="stat-value">{recipe.servings}</span>
          </div>
          <div className="stat">
            <span className="stat-icon">👤</span>
            <span className="stat-label">Author</span>
            <span className="stat-value">
              {recipe.author?.username || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="recipe-detail-actions">
          {/* Pass recipe ID to compare page via URL */}
          <Link to={`/compare?recipeA=${id}`} className="btn-secondary">
            Compare Recipe
          </Link>
          
          {/* Only show edit and delete if logged in user is the author */}
          {isLoggedIn && String(loggedInUserId) === String(recipe.author?._id) && (
            <Link to={`/edit-recipe/${id}`} className="btn-primary">
              Edit Recipe
            </Link>
          )}
          {isLoggedIn && String(loggedInUserId) === String(recipe.author?._id) && (
            <button onClick={handleDeleteRecipe} className="btn-danger">
              Delete Recipe
            </button>
          )}
        </div>
      </div>

      <div className="recipe-detail-body">

        {/* Ingredients */}
        <div className="recipe-detail-section card">
          <h2>Ingredients</h2>
          <ul className="ingredients-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="recipe-detail-section card">
          <h2>Instructions</h2>
          <p className="instructions-text">{recipe.instructions}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section card">
        <h2>Ratings & Reviews</h2>

        {/* Add review form */}
        {isLoggedIn && String(loggedInUserId) !== String(recipe.author?._id) ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <h3>Leave a Review</h3>

            {reviewError && <p className="error-message">{reviewError}</p>}
            {reviewSuccess && <p className="success-message">{reviewSuccess}</p>}

            <div className="form-group">
              <label>Rating (1-5)</label>
              <select
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
              >
                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                <option value="4">⭐⭐⭐⭐ (4)</option>
                <option value="3">⭐⭐⭐ (3)</option>
                <option value="2">⭐⭐ (2)</option>
                <option value="1">⭐ (1)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Comment</label>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                placeholder="Share your thoughts about this recipe..."
                rows="3"
              />
            </div>

            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </form>
         ) : isLoggedIn && String(loggedInUserId) === String(recipe.author?._id) ? (
          <p className="review-own-recipe">
            You cannot review your own recipe.
          </p>
        ) : (
          <p>
            <Link to="/login">Login</Link> to leave a review.
          </p>
        )}

        {/* Reviews list */}
        <div className="reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map(review => (
              <div key={review._id} className="review-item">
                <div className="review-header">
                  <span className="review-author">
                    {review.author?.username}
                  </span>
                  <span className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </span>
                </div>
                {review.comment && (
                  <p className="review-comment">{review.comment}</p>
                )}
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;