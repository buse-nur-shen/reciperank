require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// parse json request
app.use(express.json());

// parse url enconded data
app.use(express.urlencoded({ extended: true }));

//parse cookie
app.use(cookieParser());

// Allow requests from React frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Set up sessions
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// route to verify api is running
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to RecipeRank API!', status: 'running' });
});


// connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// import route modules
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const reviewRoutes = require('./routes/reviews');
// gives route handlers paths
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/reviews', reviewRoutes);

// assign server port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
