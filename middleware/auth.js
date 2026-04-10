// Middleware to check if a user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      // User is logged in, continue to the next function
      return next();
    }
    // User is not logged in, send error
    return res.status(401).json({ error: 'You must be logged in to do that.' });
  };
  
  module.exports = { isAuthenticated };