// UserProfile.js - Page to view and manage user profile
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';

function UserProfile() {
  const navigate = useNavigate();

  // State for user data
  const [user, setUser] = useState(null);
  // State for user's recipes
  const [myRecipes, setMyRecipes] = useState([]);
  // State for loading
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState('');

  // Fetch user profile and recipes when page loads
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
      // Fetch user profile
      const userRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        { credentials: 'include' }
      );

      // If not logged in redirect to login page
      if (userRes.status === 401) {
        navigate('/login');
        return;
      }

      const userData = await userRes.json();
      setUser(userData);

      // Fetch all recipes and filter by author
      const recipesRes = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        { credentials: 'include' }
      );
      const recipesData = await recipesRes.json();

      // Filter recipes by logged in user
      const userRecipes = recipesData.filter(
        recipe => recipe.author?._id === userData._id
      );
      setMyRecipes(userRecipes);
      setLoading(false);
    } catch (err) {
      setError('Failed to load profile.');
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
      navigate('/login');
    } catch (err) {
      setError('Failed to logout.');
    }
  };

  // Handle delete recipe
  const handleDeleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipeId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (res.ok) {
        // Remove deleted recipe from state
        setMyRecipes(myRecipes.filter(r => r._id !== recipeId));
      } else {
        setError('Failed to delete recipe.');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  // Show loading
  if (loading) return <p>Loading profile...</p>;

  // Show error
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-page">

      {/* Profile Header */}
      <div className="profile-header card">
        <div className="profile-avatar">
          👤
        </div>
        <div className="profile-info">
          <h1 className="profile-username">{user?.username}</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">
            Joined {new Date(user?.createdAt).toLocaleDateString()}
          </p>
          <p className="profile-recipe-count">
            {myRecipes.length} recipe{myRecipes.length !== 1 ? 's' : ''} shared
          </p>
        </div>
        <div className="profile-actions">
          <Link to="/add-recipe" className="btn-primary">
            + Add Recipe
          </Link>
          <button onClick={handleLogout} className="btn-danger">
            Logout
          </button>
        </div>
      </div>

      {/* My Recipes Section */}
      <div className="profile-recipes">
        <h2 className="section-title">My Recipes</h2>

        {myRecipes.length === 0 ? (
          <div className="no-recipes card">
            <p>You haven't added any recipes yet!</p>
            <Link to="/add-recipe" className="btn-primary">
              Add Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="recipe-grid">
            {myRecipes.map(recipe => (
              <div key={recipe._id} className="profile-recipe-item">
                <RecipeCard recipe={recipe} />
                <button
                  onClick={() => handleDeleteRecipe(recipe._id)}
                  className="btn-danger delete-recipe-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;