// RecipeCard.js - Reusable card component to display a recipe summary
import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card card">

      {/* Recipe Title */}
      <h3 className="recipe-card-title">{recipe.title}</h3>

      {/* Recipe Details */}
      <div className="recipe-card-details">
        {/* Category badge */}
        <span className="badge badge-category">{recipe.category}</span>

        {/* Subcategory badge if exists */}
        {recipe.subcategory && (
          <span className="badge badge-subcategory">{recipe.subcategory}</span>
        )}

        {/* Difficulty badge */}
        <span className={`badge badge-difficulty badge-${recipe.difficulty}`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Cooking time and servings */}
      <div className="recipe-card-info">
        <span>⏱ {recipe.cookingTime} mins</span>
        <span>🍽 {recipe.servings} servings</span>
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