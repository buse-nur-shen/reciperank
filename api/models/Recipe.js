const mongoose = require('mongoose');

// Define what a Recipe looks like in the database
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cooking', 'baking'] // only these values allowed
  },
  subcategory: {
    type: String,
    // Only relevant for baking
    enum: ['cakes', 'cookies', 'breads', 'pastries', 'desserts', null]
  },
  ingredients: [{
    type: String,
    required: true
  }],
  instructions: {
    type: String,
    required: true
  },
  cookingTime: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  servings: {
    type: Number,
    required: true
  },
  // Reference to the user who created this recipe
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Recipe', recipeSchema);