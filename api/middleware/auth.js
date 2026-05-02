//middlewre to check if a user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
      //if user is logged in continues
      return next();
    }
    // send error if not logged in
    return res.status(401).json({ error: 'You must be logged in to do that.' });
  };
  
  module.exports = { isAuthenticated };
