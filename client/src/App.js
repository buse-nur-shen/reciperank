// App.js - Main application component with routing setup
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import all pages
import Home from './pages/Home';
import LoginRegister from './pages/LoginRegister';
import BrowseRecipes from './pages/BrowseRecipes';
import AddRecipe from './pages/AddRecipe';
import RecipeDetail from './pages/RecipeDetail';
import RecipeComparison from './pages/RecipeComparison';
import UserProfile from './pages/UserProfile';

// Import navbar component
import Navbar from './components/Navbar';

// Import global styles
import './App.css';

function App() {
  return (
    <Router>
      {/* Navbar shows on every page */}
      <Navbar />
      <div className="app-container">
        <Routes>
          {/* Home page */}
          <Route path="/" element={<Home />} />
          {/* Login and Register page */}
          <Route path="/login" element={<LoginRegister />} />
          {/* Browse recipes page */}
          <Route path="/browse" element={<BrowseRecipes />} />
          {/* Add recipe page */}
          <Route path="/add-recipe" element={<AddRecipe />} />
          {/* Recipe detail page */}
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          {/* Recipe comparison page */}
          <Route path="/compare" element={<RecipeComparison />} />
          {/* User profile page */}
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;