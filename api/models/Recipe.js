const mongoose = require('mongoose');

// Define what a recipe looks like in the database
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
    // Baking and cooking subcategories
    enum: [
      'cakes', 'cookies', 'breads', 'pastries', 'desserts',
      'breakfast', 'lunch', 'dinner', 'soups', 'salads',
      null
    ]
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
  // Store image as base64 string
  image: {
    type: String,
    default: null
  },
 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);