const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { isAuthenticated } = require('../middleware/auth');

// Get top 3 recipes with most reviews
router.get('/featured', async (req, res) => {
  try {
    const Review = require('../models/Review');

    // Get all recipes
    const recipes = await Recipe.find().populate('author', 'username');

    // Count reviews for each recipe
    const recipesWithReviewCount = await Promise.all(
      recipes.map(async (recipe) => {
        const reviewCount = await Review.countDocuments({ recipe: recipe._id });
        return { ...recipe.toObject(), reviewCount };
      })
    );

    // Sort by review count and return top 3
    const featured = recipesWithReviewCount
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 3);

    res.json(featured);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Get 3 most recent baking recipes
router.get('/recent-baking', async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: 'baking' })
      .populate('author', 'username')
      .sort({ createdAt: -1 }) // newest first
      .limit(3);

    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Get all recipes 
router.get('/', async (req, res) => {
  try {
    // Build a filter object from query params
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;

    const recipes = await Recipe.find(filter).populate('author', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

//  Get one recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Create a new recipe (must be logged in)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      servings,
      image
    } = req.body;

    // Manual validation
    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }
    if (!category || !['cooking', 'baking'].includes(category)) {
      return res.status(400).json({ error: 'Category must be cooking or baking.' });
    }
    if (!ingredients || ingredients.length < 1) {
      return res.status(400).json({ error: 'At least one ingredient is required.' });
    }
    if (!instructions) {
      return res.status(400).json({ error: 'Instructions are required.' });
    }
    if (!cookingTime || cookingTime < 1) {
      return res.status(400).json({ error: 'Cooking time must be a positive number.' });
    }
    if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'Difficulty must be easy, medium, or hard.' });
    }
    if (!servings || servings < 1) {
      return res.status(400).json({ error: 'Servings must be a positive number.' });
    }

    // Create recipe with all fields including image
    const recipe = new Recipe({
      title,
      category,
      subcategory: subcategory || null,
      ingredients,
      instructions,
      cookingTime,
      difficulty,
      servings,
      image: image || null,
      author: req.session.userId
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe created!', recipe });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Update a recipe (only the author can do this)
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    // Check the logged in user is the author
    if (recipe.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own recipes.' });
    }

    const updated = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Recipe updated!', recipe: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Delete a recipe (only the author can do this)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    // Check the logged in user is the author
    if (recipe.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own recipes.' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;