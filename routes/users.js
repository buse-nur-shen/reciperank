const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/auth');

// create new user
router.post('/register', async (req, res) => {
  // get user input from request body
  try {
    const { username, email, password } = req.body;

    // validation
    // chekcs username is valid length
    if (!username || username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters.' });
    }
    // checks email is valid
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email.' });
    }
    // checks if password is atleast 6 chars
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    // checks if email already is registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }

    // creates and saves new user document
    const user = new User({ username, email, password });
    await user.save();

    // automatically logs user in
    req.session.userId = user._id;

    // set a cookie with there username
    res.cookie('username', user.username, { maxAge: 1000 * 60 * 60 * 24 });

    res.status(201).json({ message: 'Account created!', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// authenticate user and create session
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // checks if email and passward are there
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    //finds user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Checks password with hashed passward
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Saves user id to session
    req.session.userId = user._id;

    // Sets a cookie with there username
    res.cookie('username', user.username, { maxAge: 1000 * 60 * 60 * 24 });

    res.json({ message: 'Logged in!', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// log out
router.post('/logout', (req, res) => {
  // detroy session data
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Could not log out.' });
    // clears session and username cookie
    res.clearCookie('connect.sid'); 
    res.clearCookie('username');    
    res.json({ message: 'Logged out successfully.' });
  });
});

//view own profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    // find user by sessionID and return profile data
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
