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
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  // State for edit form
  const [editForm, setEditForm] = useState({ username: '' });
  // State for profile picture
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [pictureError, setPictureError] = useState('');
  // State for edit messages
  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Fetch user profile and recipes when page loads
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch user profile from backend
  const fetchProfile = async () => {
    try {
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
      setEditForm({ username: userData.username });
      setProfilePicturePreview(userData.profilePicture || null);

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

  // Handle profile picture upload
  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    setPictureError('');

    if (!file) return;

    // Only allow PNG and JPEG
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setPictureError('Only PNG and JPEG images are allowed.');
      return;
    }

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      setPictureError('Image must be smaller than 2MB.');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result);
      setProfilePicturePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove profile picture
  const removePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    setPictureError('');
  };

  // Handle edit form submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');

    // Validate username
    if (!editForm.username || editForm.username.length < 3) {
      setEditError('Username must be at least 3 characters.');
      return;
    }

    setEditLoading(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/profile`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            username: editForm.username,
            profilePicture: profilePicture || profilePicturePreview || null
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setEditError(data.error || 'Failed to update profile.');
      } else {
        setEditSuccess('Profile updated successfully!');
        setUser(data.user);
        setEditMode(false);
        fetchProfile();
      }
    } catch (err) {
      setEditError('Something went wrong. Please try again.');
    }
    setEditLoading(false);
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

        {/* Profile Picture */}
        <div className="profile-avatar-container">
          {profilePicturePreview ? (
            <img
              src={profilePicturePreview}
              alt="Profile"
              className="profile-avatar-image"
            />
          ) : (
            <div className="profile-avatar">👤</div>
          )}
        </div>

        {/* Edit mode */}
        {editMode ? (
          <form onSubmit={handleEditSubmit} className="edit-profile-form">
            <h2 className="edit-profile-title">Edit Profile</h2>

            {editError && <p className="error-message">{editError}</p>}
            {editSuccess && <p className="success-message">{editSuccess}</p>}

            {/* Username */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ username: e.target.value })}
                placeholder="Enter new username"
              />
            </div>

            {/* Profile Picture */}
            <div className="form-group">
              <label>Profile Picture (PNG or JPEG, max 2MB)</label>
              {!profilePicturePreview ? (
                <div className="image-upload-area">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handlePictureChange}
                    className="image-input"
                    id="profile-picture-input"
                  />
                  <label htmlFor="profile-picture-input" className="image-upload-label">
                    <span>📷 Click to upload picture</span>
                    <span className="image-upload-hint">PNG or JPEG only, max 2MB</span>
                  </label>
                </div>
              ) : (
                <div className="image-preview-container">
                  <img
                    src={profilePicturePreview}
                    alt="Profile preview"
                    className="profile-picture-preview"
                  />
                  <button
                    type="button"
                    onClick={removePicture}
                    className="btn-danger btn-small"
                  >
                    Remove Picture
                  </button>
                </div>
              )}
              {pictureError && <p className="error-message">{pictureError}</p>}
            </div>

            {/* Buttons */}
            <div className="edit-profile-buttons">
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setEditError('');
                  setEditSuccess('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
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
        )}

        {/* Action buttons */}
        {!editMode && (
          <div className="profile-actions">
            <button
              onClick={() => setEditMode(true)}
              className="btn-secondary"
            >
              Edit Profile
            </button>
            <Link to="/add-recipe" className="btn-primary">
              + Add Recipe
            </Link>
            <button onClick={handleLogout} className="btn-danger">
              Logout
            </button>
          </div>
        )}
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
                <div className="profile-recipe-buttons">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    className="btn-secondary edit-recipe-btn"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="btn-danger delete-recipe-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;