const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// Create a new account
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Manual validation
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // Create and save the new user
    const user = new User({ username, email, password });
    await user.save();

    // Log them in automatically after registering
    req.session.userId = user._id;

    // Set a cookie with their username
    res.cookie('username', user.username, { maxAge: 1000 * 60 * 60 * 24 });

    res.status(201).json({ message: 'Account created!', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

//  Log in
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Save user to session
    req.session.userId = user._id;

    // Set a cookie with their username
    res.cookie('username', user.username, { maxAge: 1000 * 60 * 60 * 24 });

    res.json({ message: 'Logged in!', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Log out
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not log out.' });
    res.clearCookie('connect.sid'); // clear session cookie
    res.clearCookie('username');    // clear username cookie
    res.json({ message: 'Logged out successfully.' });
  });
});

// View own profile (must be logged in)
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    // Find user but don't return the password
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// Update username and profile picture
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { username, profilePicture } = req.body;

    // Validate username
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }

    // Check if username is already taken by another user
    const existingUser = await User.findOne({
      username,
      _id: { $ne: req.session.userId }
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken.' });
    }

    // Update user
    const updated = await User.findByIdAndUpdate(
      req.session.userId,
      {
        username,
        profilePicture: profilePicture || null
      },
      { new: true }
    ).select('-password');

    res.json({ message: 'Profile updated!', user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;