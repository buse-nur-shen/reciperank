const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { isAuthenticated } = require('../middleware/auth');

// GET /api/reviews/:recipeId — Get all reviews for a recipe
router.get('/:recipeId', async (req, res) => {
  try {
    const reviews = await Review.find({ recipe: req.params.recipeId })
      .populate('author', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// POST /api/reviews/:recipeId — Add a review (must be logged in)
router.post('/:recipeId', isAuthenticated, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Manual validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
    }

    const review = new Review({
      recipe: req.params.recipeId,
      author: req.session.userId,
      rating,
      comment
    });
    await review.save();
    res.status(201).json({ message: 'Review added!', review });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// DELETE /api/reviews/:id — Delete your own review
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found.' });

    // Check the logged in user is the author
    if (review.author.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ error: 'You can only delete your own reviews.' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;