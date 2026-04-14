const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

// Get reviews for a recipe
router.get('/:recipeId', async (req, res) => {
  // find all reviews given the recipe ID
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('author', 'username');
    // returns list of reviews
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// add review to a recipe. user must be logged in
router.post('/:recipeId', isAuthenticated, async (req, res) => {
  // extract data from request body
  try {
    const { rating, comment } = req.body;

    // validation
    // ensure rating between 1 and 0
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }
    // create new review document
    const review = new Review({
      recipe: req.params.recipeId,
      author: req.session.userId,
      rating,
      comment
    });
    // saves to database and returns response
    await review.save();
    res.status(201).json({ message: 'Review added!', review });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// delete review. only author can do this
router.delete('/:id', isAuthenticated, async (req, res) => {
  //finds review by ID
  try {
    const review = await Review.findById(req.params.id);
    // if not founds returns 404
    if (!review) return res.status(404).json({ error: 'Review not found.' });

    // chekcs if user is author
    if (review.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own reviews.' });
    }
    // returns success message
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
