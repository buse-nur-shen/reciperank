const mongoose = require('mongoose');

//defines what the recipe will look like in database
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    // only these catagories
    enum: ['cooking', 'baking']
  },
  subcategory: {
    type: String,
    //only  is relevant for baking
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
    // minutes
    type: Number,
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
  // Reference to user that created 
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);
