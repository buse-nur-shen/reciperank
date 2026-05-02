import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card card">

      {/* Recipe Image*/}
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={recipe.title}
          className="recipe-card-image"
        />
      ) : (
        <div className="recipe-card-no-image">
          NA
        </div>
      )}

      {/* Recipe Title */}
      <h3 className="recipe-card-title">{recipe.title}</h3>

      {/* Recipe Details */}
      <div className="recipe-card-details">
        <span className="badge badge-category">{recipe.category}</span>
        {recipe.subcategory && (
          <span className="badge badge-subcategory">{recipe.subcategory}</span>
        )}
        <span className={`badge badge-difficulty badge-${recipe.difficulty}`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Cooking time and servings */}
      <div className="recipe-card-info">
        <span> {recipe.cookingTime} mins</span>
        <span> {recipe.servings} servings</span>
      </div>

      {/* Author */}
      <p className="recipe-card-author">
        By {recipe.author?.username || 'Unknown'}
      </p>

      {/* View Recipe button */}
      <Link to={`/recipe/${recipe._id}`} className="btn-primary recipe-card-btn">
        View Recipe
      </Link>
    </div>
  );
}

export default RecipeCard;