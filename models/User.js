const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define what a user looks like in the database
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // Profile picture stored as base64
  profilePicture: {
    type: String,
    default: null
  }
}, { timestamps: true });

// Hash password before saving to database
userSchema.pre('save', async function() {
  // Only hash if password was changed
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to check if a password is correct
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);