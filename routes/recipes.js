const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { isAuthenticated } = require('../middleware/auth');

// get all recipes 
router.get('/', async (req, res) => {
  try {
    //create a filter object based on query
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    // queries database and populates author username field
    const recipes = await Recipe.find(filter).populate('author', 'username');
    // returns recipes
    res.json(recipes);
    // error handling
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// get one reciple using ID
router.get('/:id', async (req, res) => {
  try {
    // finds recipe by ID and gets authors name. if recipe doesnt exist gives 404 error
    const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
    if (!recipe) 
      return res.status(404).json({ error: 'Recipe not found.' 
    });
    // returns recipe
    res.json(recipe);
    // error handling
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// create new recipe. must be logged in
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, category,  subcategory, ingredients,instructions, cookingTime, difficulty, servings } 
      = req.body;

    // parameter validations
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
    // creates new recipe
    const recipe = new Recipe({
      title, 
      category, 
      subcategory,
      ingredients, 
      instructions, 
      cookingTime, 
      difficulty, 
      servings,
      author: req.session.userId
    });
    // saves to database and returns success message
    await recipe.save();
    res.status(201).json({ message: 'Recipe created!', recipe });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// update recipe. onlu author can do this
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    //find recipe by id
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    // checks if user is author
    if (recipe.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only edit your own recipes.' });
    }
    // update and return recipe
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

// delete recipe. only author can do this
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    // find recipe by ID
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });

    // checks if user is author
    if (recipe.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own recipes.' });
    }
    // deletes recipe
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
